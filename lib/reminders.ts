import type { CheckInPhase, UserProfile } from "@/lib/types";

const reminderCopy: Record<CheckInPhase, string> = {
  morning:
    "Morning check-in: name your top 3 priorities, the obstacle, and the leadership behavior you will demonstrate today.",
  midday: "Midday follow-up: capture progress, blockers, and the support or decision needed to keep execution moving.",
  end_of_day: "End-of-day reflection: record what was completed, what slipped, what you learned, and the next action."
};

export function getReminderMessage(phase: CheckInPhase) {
  return reminderCopy[phase];
}

export async function sendEmailReminder(profile: UserProfile, phase: CheckInPhase) {
  if (!profile.email || !process.env.RESEND_API_KEY || !process.env.REMINDER_FROM_EMAIL) {
    return { skipped: true, reason: "Email reminder is not configured." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.REMINDER_FROM_EMAIL,
      to: profile.email,
      subject: "Leadership accountability check-in",
      text: getReminderMessage(phase)
    })
  });

  return { skipped: false, ok: response.ok };
}

export async function sendSmsReminder(profile: UserProfile, phase: CheckInPhase) {
  if (
    !profile.phone ||
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_FROM_PHONE
  ) {
    return { skipped: true, reason: "SMS reminder is not configured." };
  }

  const credentials = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString(
    "base64"
  );
  const body = new URLSearchParams({
    From: process.env.TWILIO_FROM_PHONE,
    To: profile.phone,
    Body: getReminderMessage(phase)
  });

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body
    }
  );

  return { skipped: false, ok: response.ok };
}
