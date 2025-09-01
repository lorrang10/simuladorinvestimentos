import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function para debugging detalhado
const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-SUBSCRIPTIONS] ${timestamp} ${step}${detailsStr}`);
};

// Função para processar usuário em lote 
const processBatch = async (users: any[], stripe: Stripe, supabase: any) => {
  const results = {
    processed: 0,
    updated: 0,
    expired: 0,
    errors: 0,
    expiringSoon: 0
  };

  for (const user of users) {
    try {
      results.processed++;
      logStep(`Processing user`, { email: user.email, userId: user.user_id });

      // Verificar se customer existe no Stripe
      const customers = await stripe.customers.list({ 
        email: user.email, 
        limit: 1 
      });

      if (customers.data.length === 0) {
        logStep(`Customer not found in Stripe, marking as unsubscribed`, { email: user.email });
        
        // Atualizar para não assinado
        await supabase.from("subscribers").update({
          stripe_customer_id: null,
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          updated_at: new Date().toISOString(),
        }).eq('user_id', user.user_id);

        await supabase.from("user_profiles").update({
          plano_assinatura: 'free',
          updated_at: new Date().toISOString(),
        }).eq('user_id', user.user_id);

        results.updated++;
        continue;
      }

      const customerId = customers.data[0].id;
      
      // Verificar assinaturas ativas
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      const hasActiveSub = subscriptions.data.length > 0;
      let subscriptionTier = null;
      let subscriptionEnd = null;
      let isExpiringSoon = false;

      if (hasActiveSub) {
        const subscription = subscriptions.data[0];
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        
        // Verificar se expira em 7 dias
        const expiryDate = new Date(subscription.current_period_end * 1000);
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        
        if (expiryDate <= sevenDaysFromNow) {
          isExpiringSoon = true;
          results.expiringSoon++;
          logStep(`Subscription expiring soon`, { 
            email: user.email, 
            expiryDate: subscriptionEnd 
          });
        }

        // Determinar tier baseado no preço
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount <= 999) {
          subscriptionTier = "Basic";
        } else if (amount <= 1999) {
          subscriptionTier = "Premium";
        } else {
          subscriptionTier = "Enterprise";
        }

        logStep(`Active subscription found`, { 
          email: user.email, 
          tier: subscriptionTier,
          endDate: subscriptionEnd,
          expiringSoon: isExpiringSoon
        });
      } else {
        // Verificar se tinha assinatura antes (mudança de status)
        if (user.subscribed) {
          logStep(`Subscription expired/cancelled`, { email: user.email });
          results.expired++;
        }
      }

      // Atualizar dados no Supabase se houve mudança
      const needsUpdate = (
        user.subscribed !== hasActiveSub ||
        user.subscription_tier !== subscriptionTier ||
        user.subscription_end !== subscriptionEnd ||
        user.stripe_customer_id !== customerId
      );

      if (needsUpdate) {
        await supabase.from("subscribers").update({
          stripe_customer_id: customerId,
          subscribed: hasActiveSub,
          subscription_tier: subscriptionTier,
          subscription_end: subscriptionEnd,
          updated_at: new Date().toISOString(),
        }).eq('user_id', user.user_id);

        await supabase.from("user_profiles").update({
          plano_assinatura: hasActiveSub ? 'premium' : 'free',
          updated_at: new Date().toISOString(),
        }).eq('user_id', user.user_id);

        results.updated++;
        logStep(`Updated user subscription status`, { 
          email: user.email, 
          subscribed: hasActiveSub,
          tier: subscriptionTier
        });
      }

    } catch (error) {
      results.errors++;
      logStep(`Error processing user`, { 
        email: user.email, 
        error: error.message 
      });
    }

    // Rate limiting - pausar 100ms entre cada usuário
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return results;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  logStep("Subscription sync started");

  try {
    // Verificar chave do Stripe
    const stripeKey = Deno.env.get("Chave_Stripe");
    if (!stripeKey) {
      throw new Error("Chave_Stripe is not set");
    }
    logStep("Stripe key verified");

    // Inicializar clientes
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Buscar usuários que precisam ser verificados
    const { data: subscribers, error: fetchError } = await supabase
      .from("subscribers")
      .select("*")
      .or("subscribed.eq.true,subscription_end.gte.now()");

    if (fetchError) {
      throw new Error(`Failed to fetch subscribers: ${fetchError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      logStep("No subscribers found to sync");
      return new Response(JSON.stringify({ 
        message: "No subscribers to sync",
        processed: 0,
        updated: 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep(`Found ${subscribers.length} subscribers to verify`);

    // Processar em lotes de 10 usuários
    const batchSize = 10;
    const totalResults = {
      processed: 0,
      updated: 0,
      expired: 0,
      errors: 0,
      expiringSoon: 0
    };

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      logStep(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(subscribers.length/batchSize)}`, {
        batchSize: batch.length
      });

      const batchResults = await processBatch(batch, stripe, supabase);
      
      // Agregar resultados
      totalResults.processed += batchResults.processed;
      totalResults.updated += batchResults.updated;
      totalResults.expired += batchResults.expired;
      totalResults.errors += batchResults.errors;
      totalResults.expiringSoon += batchResults.expiringSoon;

      // Pausar entre lotes para evitar rate limiting
      if (i + batchSize < subscribers.length) {
        logStep("Pausing between batches to avoid rate limits");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const duration = Date.now() - startTime;
    
    logStep("Subscription sync completed", {
      ...totalResults,
      durationMs: duration
    });

    return new Response(JSON.stringify({
      message: "Subscription sync completed successfully",
      ...totalResults,
      durationMs: duration,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    logStep("ERROR in subscription sync", { 
      message: errorMessage,
      durationMs: duration
    });

    return new Response(JSON.stringify({ 
      error: errorMessage,
      durationMs: duration,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});