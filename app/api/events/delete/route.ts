import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) { return NextResponse.json({ error: "Missing event ID" }, { status: 400 })}
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 })}
  return NextResponse.json({ message: "Event deleted successfully" })
}
