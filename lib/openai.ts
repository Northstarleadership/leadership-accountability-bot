import OpenAI from "openai";
import type { CheckIn, CheckInPayload } from "@/lib/types";
import { getExecutionScore, getRecurringBlockerAnalysis, getWeeklyReflectionSummary } from "@/lib/dashboard";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const phaseLabels = {
  morning: "morning planning",
  midday: "midday execution review",
  end_of_day: "end-of-day reflection"
};

export async function createCoachingResponse(payload: CheckInPayload) {
  if (!process.env.OPENAI_API_KEY) {
    return "OpenAI is not configured yet. Add OPENAI_API_KEY to enable coaching responses.";
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      input: [
        {
          role: "system",
          content: `You are a leadership accountability coach for business owners and senior operators.
Your tone is practical, encouraging, and direct.
Your job is to convert strategy into execution.
Rules:
- Use 2-4 short bullets.
- Start with the most important execution insight.
- Identify the likely leadership behavior required.
- Name one concrete next action.
- Be candid without sounding harsh.
- Do not use generic motivation, therapy language, or long explanations.`
        },
        {
          role: "user",
          content: `Check-in phase: ${phaseLabels[payload.phase]}

Top priorities: ${(payload.topPriorities || []).join("; ") || "Not provided"}
Obstacle: ${payload.obstacle || "Not provided"}
Leadership behavior: ${payload.leadershipBehavior || "Not provided"}
Progress: ${payload.progress || "Not provided"}
Blocked: ${payload.blocked || "Not provided"}
Support or decision needed: ${payload.supportNeeded || "Not provided"}
Completed: ${payload.completed || "Not provided"}
Not done: ${payload.notDone || "Not provided"}
Learned: ${payload.lesson || "Not provided"}
Next action: ${payload.nextAction || "Not provided"}`
        }
      ]
    });

    return response.output_text || "Stay focused: choose the next visible action and protect time to complete it.";
  } catch {
    return "Coaching is temporarily unavailable. Keep the standard: name the next visible action, assign ownership, and protect the time to complete it.";
  }
}

export async function createWeeklySummaryResponse(checkIns: CheckIn[]) {
  const executionScore = getExecutionScore(checkIns);
  const blockers = getRecurringBlockerAnalysis(checkIns);
  const reflection = getWeeklyReflectionSummary(checkIns);

  if (!process.env.OPENAI_API_KEY) {
    return `Execution score: ${executionScore}. Reflection theme: ${reflection}`;
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      input: [
        {
          role: "system",
          content:
            "You summarize a leader's week with practical accountability. Be concise, direct, and useful. Include wins, execution gaps, recurring blockers, leadership lesson, and next week's focus."
        },
        {
          role: "user",
          content: JSON.stringify(
            {
              executionScore,
              recurringBlockers: blockers,
              reflectionTheme: reflection,
              checkIns
            },
            null,
            2
          )
        }
      ]
    });

    return response.output_text || `Execution score: ${executionScore}. Next week, protect the highest-leverage priority first.`;
  } catch {
    return `Execution score: ${executionScore}. Weekly summary is temporarily unavailable, but the key reflection is: ${reflection}`;
  }
}
