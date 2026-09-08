import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/dashboard-data"
import {
  expenseCategoryColor,
  type Expense,
  type ExpenseCategory,
} from "@/lib/expenses-data"
import { cn } from "@/lib/utils"

const categoryProgress: Record<ExpenseCategory, string> = {
  "Pooja Items": "[&>div]:bg-chart-1",
  Decorations: "[&>div]:bg-chart-4",
  Prasadam: "[&>div]:bg-chart-3",
  "Sound & Lighting": "[&>div]:bg-chart-2",
  Transport: "[&>div]:bg-chart-5",
  "Printing & Posters": "[&>div]:bg-rose-500",
  Cleaning: "[&>div]:bg-sky-500",
  Contingency: "[&>div]:bg-muted-foreground",
}

export function ExpenseCategoryBreakdown({
  expenses,
}: {
  expenses: Expense[]
}) {
  const totalRecorded = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  )
  const byCategory = expenses.reduce<Record<ExpenseCategory, number>>(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount
      return acc
    },
    {} as Record<ExpenseCategory, number>,
  )
  const categoryRows = (Object.entries(byCategory) as [ExpenseCategory, number][])
    .sort((a, b) => b[1] - a[1])

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Share of recorded festival spending</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryRows.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No expenses recorded yet
          </p>
        ) : null}
        {categoryRows.map(([category, amount]) => {
          const percent = Math.round((amount / totalRecorded) * 100)
          return (
            <div key={category} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2.5 rounded-sm",
                      expenseCategoryColor[category],
                    )}
                  />
                  <span className="truncate">{category}</span>
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {formatCurrency(amount)}{" "}
                  <span className="w-10 inline-block text-right">
                    {percent}%
                  </span>
                </span>
              </div>
              <Progress
                value={percent}
                className={cn("h-1.5", categoryProgress[category])}
              />
            </div>
          )
        })}
        <p className="pt-1 text-xs text-muted-foreground">
          Based on {expenses.length} recorded expenses ·{" "}
          {formatCurrency(totalRecorded)} total
        </p>
      </CardContent>
    </Card>
  )
}