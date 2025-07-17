import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  if (!file) { return NextResponse.json({ error: "No file provided" }, { status: 400 })}

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${randomUUID()}-${file.name}`
  const { error } = await supabase.storage.from("team-image-dev").upload(fileName, buffer, { contentType: file.type })
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 })}
  const { data } = supabase.storage.from("team-image-dev").getPublicUrl(fileName)

  return NextResponse.json({ url: data.publicUrl })
}
