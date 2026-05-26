import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function cleanText(value?: string) {
  return value?.trim() || null;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();

  const { data, error } = await supabase
    .from("leader_standard_work")
    .insert({
      user_id: user.id,
      activity: cleanText(payload.activity),
      frequency: cleanText(payload.frequency),
      category: cleanText(payload.category),
      notes: cleanText(payload.notes)
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}