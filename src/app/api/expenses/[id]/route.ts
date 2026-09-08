import { NextResponse } from "next/server"

import { expenseSchema } from "@/lib/expenses-data"
import { deleteExpense, updateExpense } from "@/lib/services/expenses"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params

  const body = await request.json().catch(() => null)
  const parsed = expenseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const expense = await updateExpense(id, parsed.data)
    if (!expense) {
      return NextResponse.json({ error: "Expense not found." }, { status: 404 })
    }
    return NextResponse.json({ expense })
  } catch {
    return NextResponse.json({ error: "Failed to update expense." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const deleted = await deleteExpense(id)
    if (!deleted) {
      return NextResponse.json({ error: "Expense not found." }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete expense." }, { status: 500 })
  }
}