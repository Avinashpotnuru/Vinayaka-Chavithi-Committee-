import { z } from "zod"

import { paymentModes, type PaymentMode } from "./contributions-data"

export const expenseCategories = [
  "Pooja Items",
  "Decorations",
  "Prasadam",
  "Sound & Lighting",
  "Transport",
  "Printing & Posters",
  "Cleaning",
  "Contingency",
] as const

export type ExpenseCategory = (typeof expenseCategories)[number]

export const expenseCategoryColor: Record<ExpenseCategory, string> = {
  "Pooja Items": "bg-chart-1",
  Decorations: "bg-chart-4",
  Prasadam: "bg-chart-3",
  "Sound & Lighting": "bg-chart-2",
  Transport: "bg-chart-5",
  "Printing & Posters": "bg-rose-500",
  Cleaning: "bg-sky-500",
  Contingency: "bg-muted-foreground",
}

export type Expense = {
  id: string
  name: string
  category: ExpenseCategory
  amount: number
  date: string
  paymentMode: PaymentMode
  notes: string
}

export const expenseSchema = z.object({
  name: z.string().trim().min(2, "Expense name is required"),
  category: z.enum(expenseCategories),
  amount: z
    .number({ error: "Amount must be greater than 0" })
    .positive("Amount must be greater than 0"),
  date: z.string().min(1, "Choose an expense date"),
  paymentMode: z.enum(paymentModes),
  notes: z.string().max(200, "Notes must be under 200 characters"),
})

export type ExpenseFormValues = z.infer<typeof expenseSchema>

export const mockExpenses: Expense[] = [
  { id: "E-014", name: "Dhoop, kumkum & pooja samagri", category: "Pooja Items", amount: 2150, date: "2026-08-20", paymentMode: "Cash", notes: "Purchased from Temple Stores, Mylapore" },
  { id: "E-013", name: "Festival banner & flex posters", category: "Printing & Posters", amount: 3400, date: "2026-08-25", paymentMode: "UPI", notes: "Main banner + 8 flex posters" },
  { id: "E-012", name: "Pandal decorative flowers", category: "Decorations", amount: 4850, date: "2026-08-28", paymentMode: "UPI", notes: "Marigold & rose garlands" },
  { id: "E-011", name: "Loudspeaker & lighting setup", category: "Sound & Lighting", amount: 9200, date: "2026-08-30", paymentMode: "Bank Transfer", notes: "Advance to Sri Audio Rentals" },
  { id: "E-010", name: "Prasadam ingredients", category: "Prasadam", amount: 6800, date: "2026-09-01", paymentMode: "Cash", notes: "Rice, dal, vegetables for annadanam" },
  { id: "E-009", name: "Coconut trolley & kalash", category: "Pooja Items", amount: 1600, date: "2026-09-02", paymentMode: "Card", notes: "Copper kalash, coconut & mango leaves" },
  { id: "E-008", name: "Stage backdrop fabric", category: "Decorations", amount: 3750, date: "2026-09-02", paymentMode: "UPI", notes: "Yellow & gold backdrop cloth" },
  { id: "E-007", name: "Tent & pandal setup", category: "Decorations", amount: 11200, date: "2026-09-03", paymentMode: "Bank Transfer", notes: "Full pandal hire for the festival week" },
  { id: "E-006", name: "Electrician charges", category: "Contingency", amount: 1500, date: "2026-09-04", paymentMode: "Cash", notes: "Wiring at the mandapam" },
  { id: "E-005", name: "Vehicle hire for pooja items", category: "Transport", amount: 1800, date: "2026-09-05", paymentMode: "Cash", notes: "Tempo for materials from wholesalers" },
  { id: "E-004", name: "Annadanam cooking gas", category: "Prasadam", amount: 4200, date: "2026-09-06", paymentMode: "UPI", notes: "2 cylinders + burner repair" },
  { id: "E-003", name: "Cleaning crew", category: "Cleaning", amount: 2000, date: "2026-09-07", paymentMode: "Cash", notes: "Daily cleanup before Chavithi" },
  { id: "E-002", name: "Water cans & eco cups", category: "Contingency", amount: 900, date: "2026-09-08", paymentMode: "UPI", notes: "For distribution during festival" },
  { id: "E-001", name: "Extra speaker & mic check", category: "Sound & Lighting", amount: 1200, date: "2026-09-08", paymentMode: "Cash", notes: "Last-minute sound system rehearsal" },
]