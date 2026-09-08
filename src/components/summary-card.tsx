import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type SummaryCardProps = {
  label: string
  value: string
  icon: LucideIcon
  iconClass?: string
  className?: string
}

export function SummaryCard({
  label,
  value,
  icon: Icon,
  iconClass,
  className,
}: SummaryCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl ring-1 ring-border/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgb(0_0_0/0.5)]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-12 size-36 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-70",
          iconClass,
          "opacity-40"
        )}
      />
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className={cn(
          "pointer-events-none absolute -bottom-4 -right-3 size-20 -rotate-6 transition-transform duration-300 group-hover:rotate-0 group-hover:scale-105",
          iconClass,
          "opacity-10"
        )}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <div className="relative flex flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="pt-1.5 text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl shadow-lg shadow-black/20 ring-1 ring-inset ring-white/15 transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-110",
              iconClass
            )}
          >
            <Icon className="size-5" strokeWidth={2.2} />
          </span>
        </div>
        <p className="mt-4 bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text font-heading text-2xl font-semibold leading-snug tracking-tight text-transparent tabular-nums">
          {value}
        </p>
        <div
          aria-hidden="true"
          className="mt-3 h-1 w-10 rounded-full bg-gradient-to-r from-primary/70 to-chart-2/40"
        />
      </div>
    </Card>
  )
}