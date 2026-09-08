import { CheckCircle2, IndianRupee, PiggyBank, Wallet } from "lucide-react"

import { Card } from "@/components/ui/card"
import { ContributionBreakdown } from "@/components/dashboard/charts"
import { BiggestExpenses } from "@/components/reports/biggest-expenses"
import { ExpenseCategoryBreakdown } from "@/components/reports/expense-categories"
import { FinancialOverviewChart } from "@/components/reports/financial-overview"
import { formatCurrency } from "@/lib/dashboard-data"
import { listExpenses } from "@/lib/services/expenses"
import { getDashboardData } from "@/lib/reporting"

export const dynamic = "force-dynamic"

export default async function ReportsPage() {
  const [data, expenses] = await Promise.all([
    getDashboardData(),
    listExpenses(),
  ])

  const ratio =
    data.totalContributions > 0
      ? Math.round((data.totalExpenses / data.totalContributions) * 100)
      : 0

  const summary = [
    {
      label: "Total Contributions",
      value: data.totalContributions,
      icon: IndianRupee,
      iconClass: "bg-chart-2/15 text-chart-2",
    },
    {
      label: "Total Expenses",
      value: data.totalExpenses,
      icon: Wallet,
      iconClass: "bg-chart-3/10 text-chart-3",
    },
    {
      label: "Available Balance",
      value: data.availableBalance,
      icon: PiggyBank,
      iconClass: "bg-chart-1/10 text-chart-1",
    },
    {
      label: "Expense-to-Fund Ratio",
      value: ratio,
      icon: CheckCircle2,
      iconClass: "bg-chart-4/10 text-chart-4",
      suffix: "%",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Reports
        </h1>
        <p className="text-sm text-muted-foreground">
          A financial snapshot of the committee fund, FY 2026-27.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.label}
              className="flex items-center gap-4 p-5"
            >
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${item.iconClass}`}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-none tabular-nums">
                  {item.suffix
                    ? `${item.value}${item.suffix}`
                    : formatCurrency(item.value)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <FinancialOverviewChart
          months={data.months}
          contributions={data.contributionsMonthly}
          expenses={data.expensesMonthly}
        />
        <ContributionBreakdown
          breakdown={data.contributionByType}
          total={data.totalContributions}
        />
        <ExpenseCategoryBreakdown expenses={expenses} />
        <BiggestExpenses expenses={expenses} />
      </div>
    </div>
  )
}