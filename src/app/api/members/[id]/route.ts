import { NextResponse } from "next/server"

import { memberSchema } from "@/lib/members-data"
import { deleteMember, updateMember } from "@/lib/services/members"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params

  const body = await request.json().catch(() => null)
  const parsed = memberSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const member = await updateMember(id, parsed.data)
    if (!member) {
      return NextResponse.json(
        { error: "Member not found." },
        { status: 404 },
      )
    }
    return NextResponse.json({ member })
  } catch {
    return NextResponse.json(
      { error: "Failed to update member." },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params

  try {
    const deleted = await deleteMember(id)
    if (!deleted) {
      return NextResponse.json(
        { error: "Member not found." },
        { status: 404 },
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to delete member." },
      { status: 500 },
    )
  }
}