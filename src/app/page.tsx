import { FileDown, IndianRupee, PiggyBank, Plus, ReceiptText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FestivalBanner } from "@/components/dashboard/festival-banner"
import { KpiCard } from "@/components/dashboard/kpi-card"
import {
  ContributionBreakdown,
  ContributionsChart,
} from "@/components/dashboard/charts"
import { RecentContributions } from "@/components/dashboard/recent-contributions"
import { TopContributors } from "@/components/dashboard/top-contributors"
import { getDashboardData } from "@/lib/reporting"

export const dynamic = "force-dynamic"

export default async function Page() {
  const data = await getDashboardData()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Vinayaka Chavithi Committee &middot; Tuesday, 8 Sep 2026
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="size-4" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="size-4" />
            Add Contribution
          </Button>
        </div>
      </div>

      <FestivalBanner />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Members"
          value={data.totalMembers}
          delta={13.4}
          icon={Users}
          isCurrency={false}
          tone="bg-chart-1/10 text-chart-1"
          sparkline={data.membersMonthly}
        />
        <KpiCard
          label="Total Contributions"
          value={data.totalContributions}
          delta={18.2}
          icon={IndianRupee}
          tone="bg-chart-2/15 text-chart-2"
          sparkline={data.contributionsMonthly}
        />
        <KpiCard
          label="Total Expenses"
          value={data.totalExpenses}
          delta={-4.6}
          icon={ReceiptText}
          tone="bg-chart-3/10 text-chart-3"
          sparkline={data.expensesMonthly}
        />
        <KpiCard
          label="Available Balance"
          value={data.availableBalance}
          delta={12.7}
          icon={PiggyBank}
          tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          sparkline={data.contributionsMonthly.map(
            (c, i) => c - data.expensesMonthly[i]
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ContributionsChart
          months={data.months}
          contributions={data.contributionsMonthly}
          expenses={data.expensesMonthly}
        />
        <ContributionBreakdown
          breakdown={data.contributionByType}
          total={data.totalContributions}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RecentContributions rows={data.recentContributions} />
        <TopContributors rows={data.topContributors} />
      </div>
    </div>
  )
}