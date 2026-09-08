export const months = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
]

export type Contribution = {
  id: string
  member: string
  initials: string
  avatarColor: string
  type: string
  date: string
  amount: number
  status: "Paid" | "Pending"
}

export type TopContributor = {
  rank: number
  name: string
  initials: string
  avatarColor: string
  amount: number
}

export const festival = {
  name: "Vinayaka Chavithi",
  date: "14 Sep 2026",
  daysLeft: 6,
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number) {
  return inrFormatter.format(value)
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value)
}