import { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  description?: string
  icon?: ReactNode
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function MetricCard({
  title,
  value,
  description,
  icon,
  trend = "neutral",
  className,
}: MetricCardProps) {
  const trendColors = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-muted-foreground",
  }

  return (
    <Card className={cn("shadow-sm hover:shadow-md transition-shadow min-w-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6">
        <CardTitle className="text-sm font-medium text-muted-foreground truncate pr-2">
          {title}
        </CardTitle>
        {icon && <div className="text-primary flex-shrink-0">{icon}</div>}
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className={cn("text-base sm:text-lg lg:text-xl font-bold break-words leading-tight", trendColors[trend])}>
          {value}
        </div>
        {description && (
          <CardDescription className="text-xs text-muted-foreground mt-1 break-words">
            {description}
          </CardDescription>
        )}
      </CardContent>
    </Card>
  )
}