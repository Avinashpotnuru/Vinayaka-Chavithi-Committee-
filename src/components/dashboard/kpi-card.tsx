import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/dashboard-data"

type KpiCardProps = {
  label: string
  value: number
  delta: number
  icon: LucideIcon
  tone: string
  isCurrency?: boolean
  sparkline?: number[]
}

function Sparkline({ data, className }: { data: number[]; className?: string }) {
  const width = 96
  const height = 32
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - 3 - ((v - min) / span) * (height - 6)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-8 w-24", className)}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tone,
  isCurrency = true,
  sparkline,
}: KpiCardProps) {
  const positive = delta >= 0

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <span className={cn("flex size-10 items-center justify-center rounded-xl", tone)}>
            <Icon className="size-5" />
          </span>
          {sparkline ? (
            <Sparkline data={sparkline} className="text-muted-foreground/60" />
          ) : null}
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">
          {isCurrency ? formatCurrency(value) : value.toLocaleString("en-IN")}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium",
              positive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            )}
          >
            {positive ? (
              <TrendingUp className="size-3" />
            ) : (
              <TrendingDown className="size-3" />
            )}
            {positive ? "+" : ""}
            {delta}%
          </span>
          <span className="text-muted-foreground">vs last year</span>
        </div>
      </CardContent>
    </Card>
  )
}