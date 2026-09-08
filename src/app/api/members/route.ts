import { NextResponse } from "next/server"

import { memberSchema } from "@/lib/members-data"
import { createMember, listMembers } from "@/lib/services/members"

export async function GET() {
  try {
    const members = await listMembers()
    return NextResponse.json({ members })
  } catch {
    return NextResponse.json(
      { error: "Failed to load members." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = memberSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const member = await createMember(parsed.data)
    return NextResponse.json({ member }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create member." },
      { status: 500 },
    )
  }
}