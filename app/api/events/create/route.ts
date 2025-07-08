import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"

export async function POST(req: NextRequest) {
  const payload = await req.json()
  const { error } = await supabase.from("events").insert([payload])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
