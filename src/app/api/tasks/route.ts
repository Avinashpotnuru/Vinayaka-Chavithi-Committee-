import { NextResponse } from "next/server"

import { createTask, listTasks } from "@/lib/services/tasks"
import { taskSchema } from "@/lib/tasks-data"

export async function GET() {
  try {
    const tasks = await listTasks()
    return NextResponse.json({ tasks })
  } catch {
    return NextResponse.json({ error: "Failed to load tasks." }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = taskSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const task = await createTask(parsed.data)
    return NextResponse.json({ task }, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create task." }, { status: 500 })
  }
}