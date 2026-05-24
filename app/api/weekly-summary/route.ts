import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createWeeklySummaryResponse } from "@/lib/openai";
import { getExecutionScore, getRecurringBlockerAnalysis, getWeekBounds } from "@/lib/dashboard";
import type { CheckIn } from "@/lib/types";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const { weekStart, weekEnd } = getWeekBounds();
  const { data: checkInData, error: checkInError } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user.id)
    .gte("check_in_date", weekStart)
    .lte("check_in_date", weekEnd)
    .order("created_at", { ascending: false });

  if (checkInError) {
    return NextResponse.json({ error: checkInError.message }, { status: 500 });
  }

  const checkIns = (checkInData || []) as CheckIn[];
  const executionScore = getExecutionScore(checkIns);
  const recurringBlockers = getRecurringBlockerAnalysis(checkIns);
  const summary = await createWeeklySummaryResponse(checkIns);

  const { data, error } = await supabase
    .from("weekly_summaries")
    .upsert(
      {
        user_id: user.id,
        week_start: weekStart,
        week_end: weekEnd,
        execution_score: executionScore,
        recurring_blockers: recurringBlockers,
        summary
      },
      { onConflict: "user_id,week_start" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/dashboard");

  return NextResponse.json({ weeklySummary: data });
}
