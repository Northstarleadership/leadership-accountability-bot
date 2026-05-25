"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Clock3, Moon, Send, Sun } from "lucide-react";
import type { CheckInPayload, CheckInPhase } from "@/lib/types";

const phases: Array<{ id: CheckInPhase; label: string; icon: ReactNode }> = [
  { id: "morning", label: "Morning", icon: <Sun size={17} aria-hidden /> },
  { id: "midday", label: "Midday", icon: <Clock3 size={17} aria-hidden /> },
  { id: "end_of_day", label: "End day", icon: <Moon size={17} aria-hidden /> }
];

const obstacleOptions = [
  "Lack of time",
  "Interruptions",
  "Unclear priority",
  "Waiting on someone",
  "Too many meetings",
  "Lack of information",
  "Team resistance",
  "Firefighting",
  "Personal discipline",
  "Other"
];

const leadershipBehaviorOptions = [
  "Clarity",
  "Accountability",
  "Follow-through",
  "Delegation",
  "Listening",
  "Coaching",
  "Decisiveness",
  "Prioritization",
  "Communication",
  "Respect for people",
  "Other"
];
const middayStatusOptions = [
  "On track",
  "Slightly off track",
  "Blocked",
  "Need decision",
  "Need support"
];

const recoveryActionOptions = [
  "Reprioritize",
  "Delegate",
  "Escalate",
  "Clarify ownership",
  "Protect focus time",
  "Remove low-value work",
  "Schedule follow-up"
];
export function CheckInForm() {
  const router = useRouter();
  const [phase, setPhase] = useState<CheckInPhase>("morning");
  const [values, setValues] = useState<Record<string, string>>({});
  const [aiCoaching, setAiCoaching] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(name: string, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  function buildPayload(): CheckInPayload {
    return {
      phase,
      topPriorities: [values.priority1, values.priority2, values.priority3].filter(Boolean),
      obstacle: values.obstacle,
      obstacleCategory: values.obstacleCategory,
      leadershipBehavior: values.leadershipBehavior,
      progress: values.progress,
      leadershipBehaviorCategory: values.leadershipBehaviorCategory,
      middayStatus: values.middayStatus,
      recoveryAction: values.recoveryAction,
      blocked: values.blocked,
      supportNeeded: values.supportNeeded,
      completed: values.completed,
      notDone: values.notDone,
      lesson: values.lesson,
      nextAction: values.nextAction
    };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setAiCoaching("");

    const response = await fetch("/api/check-ins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload())
    });

    const body = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(body.error || "Unable to save check-in.");
      return;
    }

    setAiCoaching(body.aiCoaching);
    setValues({});
    router.refresh();
  }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Check in</p>
          <h2>Capture the leadership moment</h2>
        </div>
      </div>

      <div className="checkin-tabs" role="tablist" aria-label="Check-in phase">
        {phases.map((item) => (
          <button
            className={`tab-button ${phase === item.id ? "active" : ""}`}
            key={item.id}
            type="button"
            onClick={() => setPhase(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <form className="form-stack" onSubmit={submit}>
        {phase === "morning" ? (
          <>
            {[1, 2, 3].map((number) => (
              <div className="field" key={number}>
                <label htmlFor={`priority${number}`}>Top priority {number}</label>
                <input
                  className="input"
                  id={`priority${number}`}
                  value={values[`priority${number}`] || ""}
                  onChange={(event) => update(`priority${number}`, event.target.value)}
                  required={number === 1}
                />
              </div>
            ))}
<div className="field">
  <label htmlFor="obstacleCategory">
    What obstacle could get in the way?
  </label>

  <select
    className="input cursor-pointer"
    style={{ appearance: "auto" }}
    id="obstacleCategory"
    value={values.obstacleCategory || ""}
    onChange={(event) =>
      update("obstacleCategory", event.target.value)
    }
    required
  >
    <option value="">Select an obstacle</option>

    {obstacleOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>

<div className="field">
  <label htmlFor="leadershipBehaviorCategory">
    What leadership behavior do you want to demonstrate today?
  </label>

  <select
    className="input cursor-pointer"
    style={{ appearance: "auto" }}
    id="leadershipBehaviorCategory"
    value={values.leadershipBehaviorCategory || ""}
    onChange={(event) =>
      update("leadershipBehaviorCategory", event.target.value)
    }
    required
  >
    <option value="">Select a behavior</option>

    {leadershipBehaviorOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>
          </>
        ) : null}

        {phase === "midday" ? (
          <>
            <TextArea
              id="progress"
              label="What progress have you made?"
              value={values.progress}
              onChange={update}
            />
            <TextArea id="blocked" label="What is blocked?" value={values.blocked} onChange={update} />
            <TextArea
              id="supportNeeded"
              label="What support or decision is needed?"
              value={values.supportNeeded}
              onChange={update}
            />
            <div className="field">
  <label htmlFor="middayStatus">
    What is your current execution status?
  </label>

  <select
    className="input cursor-pointer"
    style={{ appearance: "auto" }}
    id="middayStatus"
    value={values.middayStatus || ""}
    onChange={(event) =>
      update("middayStatus", event.target.value)
    }
  >
    <option value="">Select status</option>

    {middayStatusOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>

<div className="field">
  <label htmlFor="recoveryAction">
    What action will help get execution back on track?
  </label>

  <select
    className="input cursor-pointer"
    style={{ appearance: "auto" }}
    id="recoveryAction"
    value={values.recoveryAction || ""}
    onChange={(event) =>
      update("recoveryAction", event.target.value)
    }
  >
    <option value="">Select recovery action</option>

    {recoveryActionOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>
          </>
        ) : null}

        {phase === "end_of_day" ? (
          <>
            <TextArea id="completed" label="What did you complete?" value={values.completed} onChange={update} />
            <TextArea id="notDone" label="What did not get done?" value={values.notDone} onChange={update} />
            <TextArea id="lesson" label="What did you learn?" value={values.lesson} onChange={update} />
            <TextArea id="nextAction" label="What is your next action?" value={values.nextAction} onChange={update} />
          </>
        ) : null}

        {error ? <p className="error">{error}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          <Send size={18} aria-hidden />
          {loading ? "Saving..." : "Save check-in"}
        </button>
      </form>

      {aiCoaching ? (
        <div className="coach-box" aria-live="polite">
          {aiCoaching}
        </div>
      ) : null}
    </section>
  );
}

function TextArea({
  id,
  label,

  value,
  onChange
}: {
  id: string;
  label: string;
  value?: string;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <textarea
        className="textarea"
        id={id}
        value={value || ""}
        onChange={(event) => onChange(id, event.target.value)}
      />
    </div>
  );
}
