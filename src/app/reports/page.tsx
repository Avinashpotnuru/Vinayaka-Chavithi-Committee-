import { CheckCircle2, IndianRupee, PiggyBank, Wallet } from "lucide-react"

import { ContributionBreakdown } from "@/components/dashboard/charts"
import { PageHeader } from "@/components/page-header"
import { SummaryCard } from "@/components/summary-card"
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
      value: formatCurrency(data.totalContributions),
      icon: IndianRupee,
      iconClass: "bg-chart-2/15 text-chart-2",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(data.totalExpenses),
      icon: Wallet,
      iconClass: "bg-chart-3/10 text-chart-3",
    },
    {
      label: "Available Balance",
      value: formatCurrency(data.availableBalance),
      icon: PiggyBank,
      iconClass: "bg-chart-1/10 text-chart-1",
    },
    {
      label: "Expense-to-Fund Ratio",
      value: `${ratio}%`,
      icon: CheckCircle2,
      iconClass: "bg-chart-4/10 text-chart-4",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <PageHeader
        title="Reports"
        description="A financial snapshot of the committee fund, FY 2026-27."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <SummaryCard
            key={item.label}
            label={item.label}
            value={item.value}
            icon={item.icon}
            iconClass={item.iconClass}
          />
        ))}
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