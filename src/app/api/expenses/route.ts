import { NextResponse } from "next/server"

import { expenseSchema } from "@/lib/expenses-data"
import { createExpense, listExpenses } from "@/lib/services/expenses"

export async function GET() {
  try {
    const expenses = await listExpenses()
    return NextResponse.json({ expenses })
  } catch {
    return NextResponse.json({ error: "Failed to load expenses." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = expenseSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const expense = await createExpense(parsed.data)
    return NextResponse.json({ expense }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create expense." }, { status: 500 })
  }
}