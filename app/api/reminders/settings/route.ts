import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function text(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function bool(value: unknown) {
  return Boolean(value);
}

export async function POST(request: Request) {
  const body = await request.json();
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(
      {
        user_id: user.id,
        email: text(body.email) || user.email,
        phone: text(body.phone),
        email_reminders_enabled: bool(body.emailRemindersEnabled),
        sms_reminders_enabled: bool(body.smsRemindersEnabled),
        morning_reminder_time: text(body.morningReminderTime) || "08:00",
        midday_reminder_time: text(body.middayReminderTime) || "12:00",
        end_of_day_reminder_time: text(body.endOfDayReminderTime) || "17:00",
        timezone: text(body.timezone) || "America/New_York"
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/dashboard");

  return NextResponse.json({ profile: data });
}
