import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createCoachingResponse } from "@/lib/openai";
import type { CheckInPayload } from "@/lib/types";

function cleanText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function validatePayload(payload: CheckInPayload) {
  if (!["morning", "midday", "end_of_day"].includes(payload.phase)) {
    return "Choose a valid check-in phase.";
  }

  if (payload.phase === "morning" && (!payload.topPriorities || payload.topPriorities.length === 0)) {
    return "Add at least one priority for the morning check-in.";
  }

  return null;
}

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckInPayload;
  const validationError = validatePayload(payload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const aiCoaching = await createCoachingResponse(payload);
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("check_ins")
    .insert({
      user_id: user.id,
      phase: payload.phase,
      check_in_date: today,
      top_priorities: payload.topPriorities?.map((item) => item.trim()).filter(Boolean) || [],
      obstacle: cleanText(payload.obstacle),
      obstacle_category: cleanText(payload.obstacleCategory),
      leadership_behavior: cleanText(payload.leadershipBehavior),
      leadership_behavior_category: cleanText(payload.leadershipBehaviorCategory),
      midday_status: cleanText(payload.middayStatus),
      recovery_action: cleanText(payload.recoveryAction),
      progress: cleanText(payload.progress),
      blocked: cleanText(payload.blocked),
      support_needed: cleanText(payload.supportNeeded),
      completed: cleanText(payload.completed),
      not_done: cleanText(payload.notDone),
      lesson: cleanText(payload.lesson),
      next_action: cleanText(payload.nextAction),
      ai_coaching: aiCoaching
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/dashboard");

  return NextResponse.json({ checkIn: data, aiCoaching });
}
