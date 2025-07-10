import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const file = searchParams.get("file")
  if (!file) { return NextResponse.json({ error: "Missing file name" }, { status: 400 })}

  const { error } = await supabase.storage.from("event-images-dev").remove([file])
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 })}

  return NextResponse.json({ success: true })
}
