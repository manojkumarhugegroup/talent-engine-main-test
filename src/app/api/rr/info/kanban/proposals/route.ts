// src/app/api/rr/info/kanban/proposals/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // You can do processing here (DB write, validation, etc.)
  console.log("Received proposal:", body)

  return NextResponse.json({ message: 'Proposal received', received: body })
}
