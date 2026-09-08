"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { festival } from "@/lib/dashboard-data"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(
    0,
    new Date(festival.target).getTime() - Date.now()
  )
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  }
}

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function CountdownTile({
  value,
  label,
  show,
}: {
  value: number
  label: string
  show: boolean
}) {
  return (
    <div
      className={
        show
          ? "rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center shadow-lg shadow-black/20 backdrop-blur-md min-w-16"
          : "hidden rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-center shadow-lg shadow-black/20 backdrop-blur-md min-w-16 sm:block"
      }
    >
      <span className="block font-heading text-2xl font-semibold leading-none tabular-nums">
        {pad(value)}
      </span>
      <span className="mt-1.5 block text-[10px] font-medium uppercase tracking-wider text-white/70">
        {label}
      </span>
    </div>
  )
}

export function FestivalBanner() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft())

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1_000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative overflow-hidden rounded-2xl border border-chart-1/40 shadow-2xl shadow-chart-1/10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#7c2d12] via-primary to-[#92400e]" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(1100px_500px_at_120%_-20%,color-mix(in_oklch,var(--chart-2)_55%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(600px_400px_at_-10%_110%,color-mix(in_oklch,var(--chart-3)_45%,transparent),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-20 size-72 rounded-full bg-chart-2/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 right-1/3 size-64 rounded-full bg-white/20 blur-3xl"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -top-10 select-none font-heading text-[10rem] font-black leading-none text-white/[0.07]"
      >
        ॐ
      </span>

      <div className="relative flex flex-col gap-8 p-6 text-white md:flex-row md:items-center md:justify-between md:p-9">
        <div className="max-w-xl space-y-4">
          <Badge className="border-primary-foreground/20 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white shadow-lg backdrop-blur-md">
            <Sparkles className="size-3.5" />
            Lord Ganesha&apos;s Arrival
          </Badge>
          <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight md:text-[2.75rem]">
            {festival.name}
            <span className="block bg-gradient-to-r from-white via-chart-2 to-white bg-clip-text text-transparent md:inline md:ml-2">
              2026
            </span>
          </h2>
          <p className="flex flex-wrap items-center gap-x-2 text-sm text-white/85">
            <span className="font-heading italic text-chart-2">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <span className="text-white/40">&middot;</span>
            <span>{festival.date}</span>
          </p>
        </div>

        <div className="flex items-end gap-2.5">
          <CountdownTile value={timeLeft.days} label="days" show />
          <CountdownTile value={timeLeft.hours} label="hrs" show={false} />
          <CountdownTile value={timeLeft.minutes} label="min" show={false} />
          <CountdownTile value={timeLeft.seconds} label="sec" show={false} />
          <div className="flex shrink-0 flex-col items-center justify-center pl-1">
            <CalendarDays className="size-5 text-chart-2" />
            <span className="mt-0.5 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider text-white/60">
              to go
            </span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
    </section>
  )
}