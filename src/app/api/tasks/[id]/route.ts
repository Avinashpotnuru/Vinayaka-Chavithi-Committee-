import { NextResponse } from "next/server"

import { deleteTask, updateTask } from "@/lib/services/tasks"
import { taskSchema } from "@/lib/tasks-data"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params

  const body = await request.json().catch(() => null)
  const parsed = taskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const task = await updateTask(id, parsed.data)
    if (!task) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 })
    }
    return NextResponse.json({ task })
  } catch {
    return NextResponse.json({ error: "Failed to update task." }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const deleted = await deleteTask(id)
    if (!deleted) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete task." }, { status: 500 })
  }
}