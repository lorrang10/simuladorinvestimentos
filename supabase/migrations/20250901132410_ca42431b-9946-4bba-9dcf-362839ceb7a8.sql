-- Configurar cron job para sincronização automática de assinaturas
-- Executa diariamente às 02:00 AM (horário UTC)
SELECT cron.schedule(
  'daily-subscription-sync',
  '0 2 * * *', -- 02:00 todos os dias
  $$
  SELECT
    net.http_post(
        url:='https://pjqeidqpehtuurxtegzo.supabase.co/functions/v1/sync-subscriptions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcWVpZHFwZWh0dXVyeHRlZ3pvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTU2ODU3OSwiZXhwIjoyMDY3MTQ0NTc5fQ.iXW-fhMIBKWyPkvR7e0hKy7eT3AeL7aLvvMajFbdoYQ"}'::jsonb,
        body:='{"source": "cron", "timestamp": "' || now() || '"}'::jsonb
    ) as request_id;
  $$
);

-- Verificar se o job foi criado com sucesso
SELECT jobname, schedule, command, active FROM cron.job WHERE jobname = 'daily-subscription-sync';