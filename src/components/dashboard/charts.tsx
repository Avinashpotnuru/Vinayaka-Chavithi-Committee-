import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCompactCurrency } from "@/lib/dashboard-data"

type Point = { x: number; y: number }

function smoothPath(points: Point[]) {
  if (points.length < 2) return ""
  let d = `M ${points[0].x},${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return d
}

function areaPath(points: Point[], baseY: number) {
  const line = smoothPath(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L ${last.x},${baseY} L ${first.x},${baseY} Z`
}

function toPoints(series: number[], width: number, innerTop: number, innerHeight: number, max: number) {
  return series.map((value, i) => ({
    x: (i / (series.length - 1)) * width,
    y: innerTop + innerHeight - (value / max) * innerHeight,
  }))
}

const WIDTH = 720
const HEIGHT = 280
const PAD_X = 10
const PAD_TOP = 18
const PAD_BOTTOM = 30
const innerWidth = WIDTH - PAD_X * 2
const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

const gridTicks = [0, 0.25, 0.5, 0.75, 1]

type ContributionsChartProps = {
  months: string[]
  contributions: number[]
  expenses: number[]
}

export function ContributionsChart({
  months,
  contributions,
  expenses,
}: ContributionsChartProps) {
  const maxValue = Math.max(0, ...contributions, ...expenses) || 1
  const contribPoints = toPoints(contributions, innerWidth, PAD_TOP, innerHeight, maxValue)
  const expensePoints = toPoints(expenses, innerWidth, PAD_TOP, innerHeight, maxValue)

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Contributions &amp; Expenses</CardTitle>
        <CardDescription>Monthly inflow vs outflow, FY 2026-27</CardDescription>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Line chart of monthly contributions against expenses"
        >
          <defs>
            <linearGradient id="contribArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridTicks.map((t) => {
            const y = PAD_TOP + innerHeight - t * innerHeight
            return (
              <g key={t}>
                <line
                  x1={PAD_X}
                  x2={WIDTH - PAD_X}
                  y1={y}
                  y2={y}
                  stroke="var(--color-border)"
                  strokeDasharray="4 4"
                />
                <text
                  x={WIDTH - PAD_X - 4}
                  y={y - 5}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  ₹{Math.round(maxValue * t)}k
                </text>
              </g>
            )
          })}

          <path d={areaPath(contribPoints, PAD_TOP + innerHeight)} fill="url(#contribArea)" />
          <path d={areaPath(expensePoints, PAD_TOP + innerHeight)} fill="url(#expenseArea)" />
          <path
            d={smoothPath(contribPoints)}
            fill="none"
            stroke="var(--color-chart-1)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d={smoothPath(expensePoints)}
            fill="none"
            stroke="var(--color-chart-3)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {months.map((label, i) => {
            if (i % 3 !== 0) return null
            const x = (i / (months.length - 1)) * innerWidth + PAD_X
            return (
              <text
                key={label}
                x={x}
                y={HEIGHT - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {label}
              </text>
            )
          })}
        </svg>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-chart-1" />
            Contributions
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-chart-3" />
            Expenses
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

type BreakdownSegment = {
  name: string
  value: number
  color: string
}

type ContributionBreakdownProps = {
  breakdown: BreakdownSegment[]
  total: number
}

export function ContributionBreakdown({ breakdown, total }: ContributionBreakdownProps) {
  const circumference = 2 * Math.PI * 46
  const offsets = breakdown.reduce<number[]>((acc, segment, i) => {
    acc.push((acc[i - 1] ?? 0) + (total > 0 ? segment.value / total : 0))
    return acc
  }, [])

  if (breakdown.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>By Contribution Type</CardTitle>
          <CardDescription>Breakdown of collected funds</CardDescription>
        </CardHeader>
        <CardContent className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
          No contributions recorded yet
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>By Contribution Type</CardTitle>
        <CardDescription>Breakdown of collected funds</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg viewBox="0 0 120 120" className="size-36" role="img" aria-label="Donut chart of contribution types">
            {breakdown.map((segment, i) => {
              const fraction = total > 0 ? segment.value / total : 0
              const dash = fraction * circumference
              return (
                <circle
                  key={segment.name}
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="16"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offsets[i] * circumference}
                  transform="rotate(-90 60 60)"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold tabular-nums">
              {formatCompactCurrency(total)}
            </span>
            <span className="text-xs text-muted-foreground">collected</span>
          </div>
        </div>

        <ul className="flex-1 space-y-3">
          {breakdown.map((segment) => (
            <li key={segment.name} className="flex items-center gap-2.5 text-sm">
              <span
                className="size-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: segment.color }}
              />
              <span className="flex-1 truncate">{segment.name}</span>
              <span className="font-semibold tabular-nums">
                {formatCompactCurrency(segment.value)}
              </span>
              <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">
                {total > 0 ? Math.round((segment.value / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}