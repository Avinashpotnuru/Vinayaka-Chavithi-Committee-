import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const WIDTH = 720
const HEIGHT = 280
const PAD_X = 10
const PAD_TOP = 18
const PAD_BOTTOM = 30
const innerWidth = WIDTH - PAD_X * 2
const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM

const gridTicks = [0, 0.25, 0.5, 0.75, 1]

export function FinancialOverviewChart({
  months,
  contributions,
  expenses,
}: {
  months: string[]
  contributions: number[]
  expenses: number[]
}) {
  const maxValue = Math.max(0, ...contributions, ...expenses) || 1
  const slot = innerWidth / months.length

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          Monthly contributions vs expenses, FY 2026-27
        </CardDescription>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Bar chart of monthly contributions against expenses"
        >
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

          {months.map((label, i) => {
            const contribution = contributions[i]
            const expense = expenses[i]
            const centerX = PAD_X + i * slot + slot / 2
            const barWidth = slot * 0.32
            const cHeight = (contribution / maxValue) * innerHeight
            const eHeight = (expense / maxValue) * innerHeight
            return (
              <g key={label}>
                <rect
                  x={centerX - barWidth - 2}
                  y={PAD_TOP + innerHeight - cHeight}
                  width={barWidth}
                  height={cHeight}
                  rx="3"
                  fill="var(--color-chart-1)"
                />
                <rect
                  x={centerX + 2}
                  y={PAD_TOP + innerHeight - eHeight}
                  width={barWidth}
                  height={eHeight}
                  rx="3"
                  fill="var(--color-chart-3)"
                />
                {i % 2 === 0 && (
                  <text
                    x={centerX}
                    y={HEIGHT - 8}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[10px]"
                  >
                    {label}
                  </text>
                )}
              </g>
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