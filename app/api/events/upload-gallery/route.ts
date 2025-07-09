import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseServer"
import { IncomingForm } from "formidable"
import fs from "fs"
import { readFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import { Readable } from "stream"

export const config = {
    api: { bodyParser: false },
}

function toNodeReadable(stream: ReadableStream<Uint8Array>): Readable {
    const reader = stream.getReader()
    return new Readable({
        async read() {
        const { done, value } = await reader.read()
        if (done) this.push(null)
        else this.push(Buffer.from(value))
        },
    })
}

export async function POST(req: NextRequest) {
    const nodeReq = toNodeReadable(req.body!) as any
    nodeReq.headers = Object.fromEntries(req.headers.entries())

    const uploadDir = path.join(process.cwd(), "tmp")
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)
    const form = new IncomingForm({ 
        uploadDir: path.join(process.cwd(), "tmp"), 
        keepExtensions: true, 
        multiples: true 
    })

    const data: any = await new Promise((resolve, reject) => {
        form.parse(nodeReq as any, (err, fields, files) => {
            if (err) reject(err)
            resolve({ fields, files })
        })
    })

    const rawFiles = data.files?.file
    if (!rawFiles) {
        return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const files = Array.isArray(rawFiles) ? rawFiles : [rawFiles]
    const uploadedUrls: string[] = []

    for (const file of files) {
        const buffer = await readFile(file.filepath)
        const fileName = `${randomUUID()}-${path.basename(file.originalFilename || "image")}`

        const { data, error } = await supabase.storage.from("event-images-dev").upload(fileName, buffer, {
            contentType: file.mimetype,
        })

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        const { publicUrl } = supabase.storage.from("event-images-dev").getPublicUrl(fileName).data
        uploadedUrls.push(publicUrl)
    }

    return NextResponse.json({ urls: uploadedUrls })
}
