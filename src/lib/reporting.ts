import { formatDate, memberById } from "@/lib/contributions-data"
import {
  type Contribution as DashboardContribution,
  type TopContributor,
  months,
} from "@/lib/dashboard-data"
import { listContributions } from "@/lib/services/contributions"
import { listExpenses } from "@/lib/services/expenses"
import { listMembers } from "@/lib/services/members"
import { getInitials } from "@/lib/members-data"

const FY_START_MONTH = 2026 * 12 + 3 // Apr 2026 (FY 2026-27)

const palette = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
]

function fyMonthIndex(iso: string | null): number {
  if (!iso) return -1
  const [year, month] = iso.split("-").map(Number)
  const index = year * 12 + (month - 1) - FY_START_MONTH
  return index >= 0 && index < months.length ? index : -1
}

export type ContributionByType = {
  name: string
  value: number
  color: string
}

export type DashboardSnapshot = {
  months: string[]
  contributionsMonthly: number[]
  expensesMonthly: number[]
  membersMonthly: number[]
  contributionByType: ContributionByType[]
  recentContributions: DashboardContribution[]
  topContributors: TopContributor[]
  totalContributions: number
  totalExpenses: number
  availableBalance: number
  totalMembers: number
}

export async function getDashboardData(): Promise<DashboardSnapshot> {
  const [members, contributions, expenses] = await Promise.all([
    listMembers(),
    listContributions(),
    listExpenses(),
  ])

  const contributionsMonthly = new Array(months.length).fill(0) as number[]
  for (const contribution of contributions) {
    const index = fyMonthIndex(contribution.paymentDate)
    if (index >= 0) contributionsMonthly[index] += contribution.paidAmount
  }

  const expensesMonthly = new Array(months.length).fill(0) as number[]
  for (const expense of expenses) {
    const index = fyMonthIndex(expense.date)
    if (index >= 0) expensesMonthly[index] += expense.amount
  }

  const totalContributions = contributions.reduce(
    (sum, contribution) => sum + contribution.paidAmount,
    0,
  )
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  )
  const availableBalance = totalContributions - totalExpenses
  const totalMembers = members.length

  const byMode = new Map<string, number>()
  for (const contribution of contributions) {
    if (contribution.paidAmount <= 0 || !contribution.paymentMode) continue
    byMode.set(
      contribution.paymentMode,
      (byMode.get(contribution.paymentMode) ?? 0) + contribution.paidAmount,
    )
  }
  const contributionByType: ContributionByType[] = [...byMode.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, value], index) => ({
      name,
      value,
      color: palette[index % palette.length],
    }))

  const recentContributions: DashboardContribution[] = contributions
    .filter((contribution) => contribution.paidAmount > 0)
    .slice()
    .sort((a, b) =>
      (b.paymentDate ?? "").localeCompare(a.paymentDate ?? ""),
    )
    .slice(0, 6)
    .map((contribution) => {
      const member = memberById[contribution.memberId]
      return {
        id: contribution.id,
        member: member?.name ?? "Unknown member",
        initials: getInitials(member?.name ?? "?"),
        avatarColor: member?.avatarColor ?? "bg-chart-1",
        type: contribution.paymentMode ?? "—",
        date: contribution.paymentDate
          ? formatDate(contribution.paymentDate)
          : "—",
        amount: contribution.paidAmount,
        status: contribution.status === "Completed" ? "Paid" : "Pending",
      }
    })

  const byMember = new Map<string, number>()
  for (const contribution of contributions) {
    byMember.set(
      contribution.memberId,
      (byMember.get(contribution.memberId) ?? 0) + contribution.paidAmount,
    )
  }
  const topContributors: TopContributor[] = [...byMember.entries()]
    .filter(([, amount]) => amount > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([memberId, amount], index) => {
      const member = memberById[memberId]
      return {
        rank: index + 1,
        name: member?.name ?? "Unknown member",
        initials: getInitials(member?.name ?? "?"),
        avatarColor: member?.avatarColor ?? "bg-chart-1",
        amount,
      }
    })

  return {
    months,
    contributionsMonthly,
    expensesMonthly,
    membersMonthly: months.map(() => totalMembers),
    contributionByType,
    recentContributions,
    topContributors,
    totalContributions,
    totalExpenses,
    availableBalance,
    totalMembers,
  }
}