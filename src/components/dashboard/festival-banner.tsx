import { CalendarDays, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { festival } from "@/lib/dashboard-data"

export function FestivalBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-chart-1 to-chart-2 p-6 text-primary-foreground shadow-sm md:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-20 right-24 size-40 rounded-full bg-black/10 blur-2xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Badge
            variant="secondary"
            className="border-transparent bg-white/20 text-primary-foreground"
          >
            <Sparkles className="size-3.5" />
            Lord Ganesha&apos;s Arrival
          </Badge>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {festival.name} 2026
          </h2>
          <p className="text-sm text-primary-foreground/90">
            ॥ श्री गणेशाय नमः ॥ &middot; {festival.date} &middot;{" "}
            {festival.daysLeft} days to go
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/15 px-5 py-4 text-center backdrop-blur">
            <span className="text-2xl font-semibold tabular-nums">
              {festival.daysLeft}
            </span>
            <span className="block text-xs text-primary-foreground/80">
              days
            </span>
          </div>
          <div className="hidden rounded-xl bg-white/15 px-5 py-4 text-center backdrop-blur sm:block">
            <span className="text-2xl font-semibold tabular-nums">06</span>
            <span className="block text-xs text-primary-foreground/80">
              hours
            </span>
          </div>
          <div className="hidden rounded-xl bg-white/15 px-5 py-4 text-center backdrop-blur sm:block">
            <span className="text-2xl font-semibold tabular-nums">12</span>
            <span className="block text-xs text-primary-foreground/80">
              mins
            </span>
          </div>
        </div>
      </div>
      <span className="absolute bottom-3 right-4 text-primary-foreground/40">
        <CalendarDays className="size-14" />
      </span>
    </div>
  )
}