import { z } from "zod"

import { memberById, formatDate } from "./contributions-data"
import type { Member } from "./members-data"

export const taskStatuses = [
  "To Do",
  "In Progress",
  "Done",
  "Overdue",
] as const

export type TaskStatus = (typeof taskStatuses)[number]

export type Task = {
  id: string
  name: string
  memberId: string
  dueDate: string
  status: TaskStatus
}

export const taskSchema = z.object({
  name: z.string().trim().min(2, "Task name is required"),
  memberId: z.string().min(1, "Select an assigned member"),
  dueDate: z.string().min(1, "Choose a due date"),
  status: z.enum(taskStatuses),
})

export type TaskFormValues = z.infer<typeof taskSchema>

export const TODAY = "2026-09-08"

export const mockTasks: Task[] = [
  { id: "T-012", name: "Buy pooja samagri", memberId: "M-014", dueDate: "2026-08-30", status: "Done" },
  { id: "T-011", name: "Book pandal & tent vendor", memberId: "M-012", dueDate: "2026-09-05", status: "Done" },
  { id: "T-010", name: "Order flex banners", memberId: "M-010", dueDate: "2026-09-05", status: "In Progress" },
  { id: "T-009", name: "Arrange sound system", memberId: "M-009", dueDate: "2026-09-06", status: "In Progress" },
  { id: "T-008", name: "Collect contributions from households", memberId: "M-011", dueDate: "2026-09-10", status: "In Progress" },
  { id: "T-007", name: "Prepare prasadam menu", memberId: "M-003", dueDate: "2026-09-07", status: "To Do" },
  { id: "T-006", name: "Confirm electrician for wiring", memberId: "M-004", dueDate: "2026-09-04", status: "Overdue" },
  { id: "T-005", name: "Buy water cans & eco cups", memberId: "M-006", dueDate: "2026-09-08", status: "Done" },
  { id: "T-004", name: "Clean mandapam before Chavithi", memberId: "M-009", dueDate: "2026-09-12", status: "To Do" },
  { id: "T-003", name: "Coordinate transport for materials", memberId: "M-002", dueDate: "2026-09-06", status: "Overdue" },
  { id: "T-002", name: "Design invitations & distribute", memberId: "M-007", dueDate: "2026-09-05", status: "Done" },
  { id: "T-001", name: "Final count of contributions", memberId: "M-014", dueDate: "2026-09-13", status: "To Do" },
]

export function getMember(memberId: string) {
  return memberById[memberId]
}

export function getMemberName(memberId: string) {
  return (getMember(memberId) as Member | undefined)?.name ?? "Unknown"
}

export function isPastDue(task: Task) {
  return task.dueDate < TODAY && task.status !== "Done"
}

export { formatDate }