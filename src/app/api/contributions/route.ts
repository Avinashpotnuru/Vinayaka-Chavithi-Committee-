import { NextResponse } from "next/server"

import { contributionSchema } from "@/lib/contributions-data"
import {
  createContribution,
  listContributions,
} from "@/lib/services/contributions"

export async function GET() {
  try {
    const contributions = await listContributions()
    return NextResponse.json({ contributions })
  } catch {
    return NextResponse.json(
      { error: "Failed to load contributions." },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = contributionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid data." },
      { status: 400 },
    )
  }

  try {
    const contribution = await createContribution(parsed.data)
    return NextResponse.json({ contribution }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create contribution." },
      { status: 500 },
    )
  }
}