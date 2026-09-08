export const memberRoles = [
  "President",
  "Secretary",
  "Treasurer",
  "Member",
  "Volunteer",
] as const

export const memberStatuses = ["Active", "Inactive", "Pending"] as const

import { z } from "zod"

export type MemberRole = (typeof memberRoles)[number]
export type MemberStatus = (typeof memberStatuses)[number]

export const memberSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  houseNumber: z.string().trim().min(1, "House number is required"),
  role: z.enum(memberRoles),
  status: z.enum(memberStatuses),
})

export type MemberFormValues = z.infer<typeof memberSchema>

export type Member = {
  id: string
  name: string
  mobile: string
  houseNumber: string
  role: MemberRole
  status: MemberStatus
  avatarColor: string
}

export const mockMembers: Member[] = [
  { id: "M-014", name: "Ramesh Iyer", mobile: "9870512345", houseNumber: "12-3-508/A", role: "Treasurer", status: "Active", avatarColor: "bg-chart-1" },
  { id: "M-013", name: "Lakshmi Narayanan", mobile: "9000811223", houseNumber: "8-2-293/4", role: "President", status: "Active", avatarColor: "bg-chart-4" },
  { id: "M-012", name: "Venkatesh Rao", mobile: "9849012345", houseNumber: "5-1-123/B", role: "Secretary", status: "Active", avatarColor: "bg-chart-2" },
  { id: "M-011", name: "Divya Krishnan", mobile: "9959001122", houseNumber: "12-1-33/C", role: "Member", status: "Active", avatarColor: "bg-chart-3" },
  { id: "M-010", name: "Suresh Menon", mobile: "9848012340", houseNumber: "HIG 45", role: "Volunteer", status: "Active", avatarColor: "bg-chart-5" },
  { id: "M-009", name: "Anitha Prasad", mobile: "9700712345", houseNumber: "6-3-789/2", role: "Member", status: "Active", avatarColor: "bg-chart-1" },
  { id: "M-008", name: "Karthik Subramaniam", mobile: "9000011223", houseNumber: "D/No 24-1-12", role: "Member", status: "Pending", avatarColor: "bg-chart-3" },
  { id: "M-007", name: "Meena Chandrasekar", mobile: "9444012345", houseNumber: "3-4-110", role: "Member", status: "Active", avatarColor: "bg-chart-4" },
  { id: "M-006", name: "Prakash Reddy", mobile: "9885098765", houseNumber: "H No 7-2-99", role: "Volunteer", status: "Active", avatarColor: "bg-chart-2" },
  { id: "M-005", name: "Shobana Venkat", mobile: "9123456780", houseNumber: "11-3-45", role: "Member", status: "Inactive", avatarColor: "bg-chart-5" },
  { id: "M-004", name: "Murugan Ganapathy", mobile: "9445501223", houseNumber: "9-1-200/1", role: "Member", status: "Active", avatarColor: "bg-chart-1" },
  { id: "M-003", name: "Jayalakshmi Rao", mobile: "9886712345", houseNumber: "2-2-87", role: "Member", status: "Active", avatarColor: "bg-chart-3" },
  { id: "M-002", name: "Arvind Sharma", mobile: "9000911123", houseNumber: "15-1-6/D", role: "Volunteer", status: "Pending", avatarColor: "bg-chart-4" },
  { id: "M-001", name: "Gopal Krishnamurthy", mobile: "9848301223", houseNumber: "4-2-190", role: "Member", status: "Inactive", avatarColor: "bg-chart-2" },
]

export const avatarColors = [
  "bg-chart-1",
  "bg-chart-4",
  "bg-chart-2",
  "bg-chart-3",
  "bg-chart-5",
]

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function formatMobile(mobile: string) {
  return `+91 ${mobile.slice(0, 5)} ${mobile.slice(5)}`
}