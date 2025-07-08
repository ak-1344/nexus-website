import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  const body = await req.json()
  if (!id) { return NextResponse.json({ message: "Missing event ID" }, { status: 400 })}
  const { error } = await supabase.from("events").update(body).eq("id", id)
  if (error) { return NextResponse.json({ message: error.message }, { status: 500 })}
  return NextResponse.json({ message: "Event updated successfully" })
}
