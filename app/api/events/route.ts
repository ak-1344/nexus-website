import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const isPinned = searchParams.get("isPinned")
  console.log("Pinned: ", isPinned)
  let query = supabase.from("events").select("*")
  if (status) { query = query.eq("status", status)}
  if (isPinned) { query = query.eq("isPinned", true)}

  const { data, error } = await query

  if (error) { return NextResponse.json({ error: error.message }, { status: 500 })}
  return NextResponse.json({ data }, { status: 200 })
}
