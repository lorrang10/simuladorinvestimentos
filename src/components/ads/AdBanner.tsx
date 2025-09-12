import { AdWrapper } from './AdWrapper'
import { AdManager } from './AdManager'

interface AdBannerProps {
  variant?: 'top' | 'bottom' | 'sidebar' | 'inline'
  showUpgradeHint?: boolean
  onUpgradeClick?: () => void
  className?: string
}

export function AdBanner({ 
  variant = 'inline', 
  showUpgradeHint = true,
  onUpgradeClick,
  className = '' 
}: AdBannerProps) {
  
  const getAdConfig = () => {
    switch (variant) {
      case 'top':
        return {
          slot: 'banner' as const,
          type: 'banner' as const,
          position: 'top' as const,
          format: 'horizontal' as const,
          className: 'mb-4'
        }
      case 'bottom':
        return {
          slot: 'footer' as const,
          type: 'banner' as const,
          position: 'bottom' as const,
          format: 'horizontal' as const,
          className: 'mt-4'
        }
      case 'sidebar':
        return {
          slot: 'sidebar' as const,
          type: 'banner' as const,
          position: 'bottom' as const,
          format: 'rectangle' as const,
          className: 'my-2'
        }
      case 'inline':
      default:
        return {
          slot: 'native' as const,
          type: 'banner' as const,
          position: 'bottom' as const,
          format: 'auto' as const,
          className: 'my-4'
        }
    }
  }

  const config = getAdConfig()

  return (
    <AdWrapper 
      showUpgradeHint={showUpgradeHint} 
      onUpgradeClick={onUpgradeClick}
      className={`${config.className} ${className}`}
    >
      <AdManager
        slot={config.slot}
        type={config.type}
        position={config.position}
        format={config.format}
        className="w-full"
      />
    </AdWrapper>
  )
}