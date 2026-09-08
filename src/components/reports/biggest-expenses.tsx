import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/dashboard-data"
import type { Expense } from "@/lib/expenses-data"

export function BiggestExpenses({ expenses }: { expenses: Expense[] }) {
  const topExpenses = [...expenses]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Biggest Expenses</CardTitle>
        <CardDescription>Top 5 recorded festival spends</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topExpenses.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No expenses recorded yet
          </p>
        ) : null}
        {topExpenses.map((expense, index) => (
          <div key={expense.id} className="flex items-center gap-3">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-muted-foreground">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-tight">
                {expense.name}
              </p>
              <Badge
                variant="outline"
                className="mt-1 h-5 border-border text-[10px] font-medium text-muted-foreground"
              >
                {expense.category}
              </Badge>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {formatCurrency(expense.amount)}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}