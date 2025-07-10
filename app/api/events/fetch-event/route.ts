import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("id");

  if (!eventId) { return NextResponse.json({ error: "Missing event id" }, { status: 400 });}

  const { data, error } = await supabase.from("events").select("*").eq("id", eventId).single();
  /* if (!data) { return NextResponse.json({ error: "Event not found" }, { status: 404})} */
  if (error) { return NextResponse.json({ error: error.message }, { status: 500 });}

  return NextResponse.json({ data }, { status: 200 });
}
