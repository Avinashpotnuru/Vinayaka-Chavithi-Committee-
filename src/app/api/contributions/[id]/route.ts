import { NextResponse } from "next/server"

import { contributionSchema } from "@/lib/contributions-data"
import {
  deleteContribution,
  updateContribution,
} from "@/lib/services/contributions"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params

  const body = await request.json().catch(() => null)
  const parsed = contributionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const contribution = await updateContribution(id, parsed.data)
    if (!contribution) {
      return NextResponse.json(
        { error: "Contribution not found." },
        { status: 404 },
      )
    }
    return NextResponse.json({ contribution })
  } catch {
    return NextResponse.json(
      { error: "Failed to update contribution." },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const deleted = await deleteContribution(id)
    if (!deleted) {
      return NextResponse.json(
        { error: "Contribution not found." },
        { status: 404 },
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete contribution." },
      { status: 500 },
    )
  }
}