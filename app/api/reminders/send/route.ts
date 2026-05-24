import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmailReminder, sendSmsReminder } from "@/lib/reminders";
import type { CheckInPhase, UserProfile } from "@/lib/types";

const phaseTimes: Array<{ phase: CheckInPhase; field: keyof UserProfile }> = [
  { phase: "morning", field: "morning_reminder_time" },
  { phase: "midday", field: "midday_reminder_time" },
  { phase: "end_of_day", field: "end_of_day_reminder_time" }
];

function isDue(profile: UserProfile, field: keyof UserProfile) {
  const now = new Date();
  const localTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: profile.timezone
  }).format(now);

  return String(profile[field]).slice(0, 5) === localTime;
}

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .or("email_reminders_enabled.eq.true,sms_reminders_enabled.eq.true");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const profiles = (data || []) as UserProfile[];
  const results = [];

  for (const profile of profiles) {
    for (const item of phaseTimes) {
      if (!isDue(profile, item.field)) continue;

      if (profile.email_reminders_enabled) {
        const result = await sendEmailReminder(profile, item.phase);
        results.push({ userId: profile.user_id, phase: item.phase, channel: "email", result });
        await supabase.from("reminder_logs").insert({
          user_id: profile.user_id,
          phase: item.phase,
          channel: "email",
          status: result.skipped || ("ok" in result && result.ok) ? "sent" : "failed"
        });
      }

      if (profile.sms_reminders_enabled) {
        const result = await sendSmsReminder(profile, item.phase);
        results.push({ userId: profile.user_id, phase: item.phase, channel: "sms", result });
        await supabase.from("reminder_logs").insert({
          user_id: profile.user_id,
          phase: item.phase,
          channel: "sms",
          status: result.skipped || ("ok" in result && result.ok) ? "sent" : "failed"
        });
      }
    }
  }

  return NextResponse.json({ sent: results.length, results });
}
