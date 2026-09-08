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
  const width = 72
  const height = 28
  const max = Math.max(...data)
  const min = Math.min(...data)
  const span = max - min || 1
  const area = `${width / 2},${height} ${data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - 3 - ((v - min) / span) * (height - 6)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(" ")} ${width},${height}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn("h-7 w-[72px]", className)}
      aria-hidden="true"
    >
      <polygon points={area} fill="currentColor" opacity="0.12" />
      <polyline
        points={data
          .map((v, i) => {
            const x = (i / (data.length - 1)) * width
            const y = height - 3 - ((v - min) / span) * (height - 6)
            return `${x.toFixed(1)},${y.toFixed(1)}`
          })
          .join(" ")}
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
    <Card className="group relative overflow-hidden rounded-2xl ring-1 ring-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(0_0_0/0.5)]">
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-12 size-36 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-70",
          tone,
          "opacity-40"
        )}
      />
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn(
          "pointer-events-none absolute -bottom-4 -right-3 size-20 -rotate-6 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105",
          tone,
          "opacity-10"
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <CardContent className="relative flex flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-lg shadow-black/20 ring-1 ring-inset ring-white/15 transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-110",
              tone
            )}
          >
            <Icon className="size-5" strokeWidth={2.2} />
          </span>
          {sparkline ? (
            <Sparkline
              data={sparkline}
              className={cn(
                positive
                  ? "text-emerald-500 dark:text-emerald-400"
                  : "text-rose-500 dark:text-rose-400"
              )}
            />
          ) : null}
        </div>
        <p className="mt-4 text-xs font-medium text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text font-heading text-2xl font-semibold leading-snug tracking-tight text-transparent tabular-nums">
          {isCurrency
            ? formatCurrency(value)
            : value.toLocaleString("en-IN")}
        </p>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
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
          <span className="text-muted-foreground/80">vs last year</span>
        </div>
      </CardContent>
    </Card>
  )
}