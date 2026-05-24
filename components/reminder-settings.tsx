"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Bell } from "lucide-react";
import type { UserProfile } from "@/lib/types";

export function ReminderSettings({
  profile,
  fallbackEmail
}: {
  profile: UserProfile | null;
  fallbackEmail?: string | null;
}) {
  const [values, setValues] = useState({
    email: profile?.email || fallbackEmail || "",
    phone: profile?.phone || "",
    emailRemindersEnabled: profile?.email_reminders_enabled ?? true,
    smsRemindersEnabled: profile?.sms_reminders_enabled ?? false,
    morningReminderTime: profile?.morning_reminder_time?.slice(0, 5) || "08:00",
    middayReminderTime: profile?.midday_reminder_time?.slice(0, 5) || "12:00",
    endOfDayReminderTime: profile?.end_of_day_reminder_time?.slice(0, 5) || "17:00",
    timezone: profile?.timezone || "America/New_York"
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(name: string, value: string | boolean) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");

    const response = await fetch("/api/reminders/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const body = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(body.error || "Unable to save reminders.");
      return;
    }

    setStatus("Reminder settings saved.");
  }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Reminders</p>
          <h2>Email and SMS nudges</h2>
        </div>
        <Bell size={20} aria-hidden />
      </div>
      <form className="form-stack" onSubmit={save}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="phone">SMS phone</label>
          <input
            className="input"
            id="phone"
            value={values.phone}
            onChange={(event) => update("phone", event.target.value)}
            placeholder="+15555555555"
          />
        </div>
        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              checked={values.emailRemindersEnabled}
              onChange={(event) => update("emailRemindersEnabled", event.target.checked)}
            />
            Email reminders
          </label>
          <label>
            <input
              type="checkbox"
              checked={values.smsRemindersEnabled}
              onChange={(event) => update("smsRemindersEnabled", event.target.checked)}
            />
            SMS reminders
          </label>
        </div>
        <div className="time-grid">
          <div className="field">
            <label htmlFor="morning">Morning</label>
            <input
              className="input"
              id="morning"
              type="time"
              value={values.morningReminderTime}
              onChange={(event) => update("morningReminderTime", event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="midday">Midday</label>
            <input
              className="input"
              id="midday"
              type="time"
              value={values.middayReminderTime}
              onChange={(event) => update("middayReminderTime", event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="endOfDay">End day</label>
            <input
              className="input"
              id="endOfDay"
              type="time"
              value={values.endOfDayReminderTime}
              onChange={(event) => update("endOfDayReminderTime", event.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="timezone">Timezone</label>
          <input
            className="input"
            id="timezone"
            value={values.timezone}
            onChange={(event) => update("timezone", event.target.value)}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        {status ? <p className="success">{status}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save reminders"}
        </button>
      </form>
    </section>
  );
}
