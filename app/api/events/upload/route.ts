// app/api/events/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {

  /* console.log("Received request to upload file: ", req) */
  const formData = await req.formData()
  /* console.log("Parsed form data: ", formData) */
  const file = formData.get("file") as File
  /* console.log("Extracted file: ", file) */
  if (!file) { return NextResponse.json({ error: "No file provided" }, { status: 400 })}

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = `${randomUUID()}-${file.name}`
  /* console.log("Generated file name: ", fileName) */
  const { error } = await supabase.storage.from("event-images-dev").upload(fileName, buffer, { contentType: file.type })
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 })}

  const { data } = supabase.storage.from("event-images-dev").getPublicUrl(fileName)

  return NextResponse.json({ url: data.publicUrl })
}
