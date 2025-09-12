import { useAdVisibility } from '@/hooks/useAdVisibility'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

interface AdWrapperProps {
  children: React.ReactNode
  showUpgradeHint?: boolean
  onUpgradeClick?: () => void
  className?: string
}

export function AdWrapper({ 
  children, 
  showUpgradeHint = false, 
  onUpgradeClick,
  className = '' 
}: AdWrapperProps) {
  const { shouldShowAds, isPremium } = useAdVisibility()

  // Se é usuário premium, não mostrar nada
  if (isPremium) {
    return null
  }

  // Se não deve mostrar anúncios, não mostrar nada
  if (!shouldShowAds) {
    return null
  }

  return (
    <div className={`ad-wrapper ${className}`}>
      {children}
      
      {showUpgradeHint && (
        <div className="mt-2 p-2 bg-muted/50 rounded-md border border-border">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Remova anúncios com Premium
            </span>
            {onUpgradeClick && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={onUpgradeClick}
                className="h-6 px-2 text-xs"
              >
                <Crown className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}