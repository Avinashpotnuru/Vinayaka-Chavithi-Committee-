import { z } from "zod"

import { mockMembers, type Member } from "./members-data"

export const paymentModes = [
  "Cash",
  "UPI",
  "Card",
  "Bank Transfer",
  "Cheque",
] as const

export const contributionStatuses = [
  "Completed",
  "Partial",
  "Pending",
  "Overdue",
] as const

export type PaymentMode = (typeof paymentModes)[number]
export type ContributionStatus = (typeof contributionStatuses)[number]

export type Contribution = {
  id: string
  memberId: string
  expectedAmount: number
  paidAmount: number
  paymentMode: PaymentMode | null
  paymentDate: string | null
  status: ContributionStatus
}

export const memberById: Record<string, Member> = Object.fromEntries(
  mockMembers.map((member) => [member.id, member]),
)

export const contributionSchema = z
  .object({
    memberId: z.string().min(1, "Select a member"),
    expectedAmount: z
      .number({ error: "Expected amount must be greater than 0" })
      .positive("Expected amount must be greater than 0"),
    paidAmount: z
      .number({ error: "Paid amount cannot be negative" })
      .min(0, "Paid amount cannot be negative"),
    paymentMode: z.enum(paymentModes).nullable(),
    paymentDate: z.string().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.paidAmount > data.expectedAmount) {
      ctx.addIssue({
        code: "custom",
        path: ["paidAmount"],
        message: "Paid amount cannot exceed the expected amount",
      })
    }
    if (data.paidAmount > 0 && !data.paymentMode) {
      ctx.addIssue({
        code: "custom",
        path: ["paymentMode"],
        message: "Select a payment mode",
      })
    }
    if (data.paidAmount > 0 && !data.paymentDate) {
      ctx.addIssue({
        code: "custom",
        path: ["paymentDate"],
        message: "Choose a payment date",
      })
    }
  })

export type ContributionFormValues = z.infer<typeof contributionSchema>

export const mockContributions: Contribution[] = [
  { id: "C-014", memberId: "M-013", expectedAmount: 1100, paidAmount: 1100, paymentMode: "Cash", paymentDate: "2026-09-04", status: "Completed" },
  { id: "C-013", memberId: "M-012", expectedAmount: 1100, paidAmount: 1100, paymentMode: "UPI", paymentDate: "2026-09-05", status: "Completed" },
  { id: "C-012", memberId: "M-014", expectedAmount: 1100, paidAmount: 1100, paymentMode: "Bank Transfer", paymentDate: "2026-09-05", status: "Completed" },
  { id: "C-011", memberId: "M-011", expectedAmount: 1100, paidAmount: 550, paymentMode: "UPI", paymentDate: "2026-09-06", status: "Partial" },
  { id: "C-010", memberId: "M-010", expectedAmount: 550, paidAmount: 550, paymentMode: "Cash", paymentDate: "2026-09-06", status: "Completed" },
  { id: "C-009", memberId: "M-009", expectedAmount: 1100, paidAmount: 1100, paymentMode: "UPI", paymentDate: "2026-09-07", status: "Completed" },
  { id: "C-008", memberId: "M-008", expectedAmount: 550, paidAmount: 0, paymentMode: null, paymentDate: null, status: "Pending" },
  { id: "C-007", memberId: "M-007", expectedAmount: 1100, paidAmount: 550, paymentMode: "Cash", paymentDate: "2026-09-08", status: "Partial" },
  { id: "C-006", memberId: "M-006", expectedAmount: 550, paidAmount: 0, paymentMode: null, paymentDate: null, status: "Overdue" },
  { id: "C-005", memberId: "M-005", expectedAmount: 1050, paidAmount: 0, paymentMode: null, paymentDate: null, status: "Overdue" },
  { id: "C-004", memberId: "M-004", expectedAmount: 550, paidAmount: 550, paymentMode: "Cheque", paymentDate: "2026-09-08", status: "Completed" },
  { id: "C-003", memberId: "M-003", expectedAmount: 1100, paidAmount: 275, paymentMode: "Card", paymentDate: "2026-09-08", status: "Partial" },
  { id: "C-002", memberId: "M-002", expectedAmount: 550, paidAmount: 0, paymentMode: null, paymentDate: null, status: "Pending" },
  { id: "C-001", memberId: "M-001", expectedAmount: 1100, paidAmount: 1100, paymentMode: "UPI", paymentDate: "2026-09-08", status: "Completed" },
]

export function deriveContributionStatus(
  expectedAmount: number,
  paidAmount: number,
): ContributionStatus {
  if (paidAmount >= expectedAmount) return "Completed"
  if (paidAmount > 0) return "Partial"
  return "Pending"
}

export function formatDate(iso: string | null) {
  if (!iso) return "—"
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}