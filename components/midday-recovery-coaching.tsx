import type { CheckIn } from "@/lib/types";

type MiddayRecoveryCoachingProps = {
  checkIns: CheckIn[];
};

export function MiddayRecoveryCoaching({
  checkIns
}: MiddayRecoveryCoachingProps) {
  const middayCheckIns = checkIns.filter(
    (checkIn) => checkIn.phase === "midday"
  );

  const latestMidday = middayCheckIns[0];

  if (!latestMidday) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Midday Recovery Coaching</h2>
        <p className="mt-2 text-sm text-gray-500">
          Complete a midday check-in to receive recovery coaching for the rest of the day.
        </p>
      </div>
    );
  }

  const status = latestMidday.midday_status;
  const recoveryAction = latestMidday.recovery_action;

  let coaching =
    "Use the middle of the day as a reset point. Review what matters most, reduce unnecessary work, and choose one action that improves execution.";

  if (status === "On track") {
    coaching =
      "You are currently on track. Protect the rhythm by staying focused on your highest-value priorities and avoiding unnecessary work expansion.";
  }

  if (status === "Slightly off track") {
    coaching =
      "You are slightly off track. This is the right moment to pause, reduce work-in-progress, and choose the next most important action.";
  }

  if (status === "Blocked") {
    coaching =
      "You are blocked. Name the blocker clearly, identify who owns the next decision, and avoid spending more time on work that cannot move forward.";
  }

  if (status === "Need decision") {
    coaching =
      "A decision is needed. Clarify the decision, identify the decision owner, and ask for a clear yes, no, or next step.";
  }

  if (status === "Need support") {
    coaching =
      "Support is needed. Ask early and specifically. Strong leaders surface support needs before delays become execution failures.";
  }

  let actionCoaching =
    "Choose one recovery action and make it visible before the day gets away from you.";

  if (recoveryAction === "Reprioritize") {
    actionCoaching =
      "Reprioritize by narrowing the day to the few outcomes that still matter most. Remove or defer anything that does not support execution.";
  }

  if (recoveryAction === "Delegate") {
    actionCoaching =
      "Delegate by clarifying the outcome, owner, and deadline. Avoid simply handing off tasks without context.";
  }

  if (recoveryAction === "Escalate") {
    actionCoaching =
      "Escalate with clarity. State the issue, the impact, the decision needed, and the time sensitivity.";
  }

  if (recoveryAction === "Clarify ownership") {
    actionCoaching =
      "Clarify ownership by naming who owns the next step, what must happen, and when follow-up should occur.";
  }

  if (recoveryAction === "Protect focus time") {
    actionCoaching =
      "Protect focus time by blocking distractions and creating a short window for deep execution on the highest-value work.";
  }

  if (recoveryAction === "Remove low-value work") {
    actionCoaching =
      "Remove low-value work by identifying what can be paused, simplified, or stopped without damaging the outcome.";
  }

  if (recoveryAction === "Schedule follow-up") {
    actionCoaching =
      "Schedule follow-up before the day ends. Accountability improves when the next touchpoint is clear and visible.";
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Midday Recovery Coaching</h2>

      <p className="mt-1 text-sm text-gray-500">
        Use your midday check-in to recover execution before the day gets away from you.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Current Status</p>
          <p className="mt-1 text-lg font-semibold">
            {status || "No status selected"}
          </p>
        </div>

      </div>

      <div
         className="mt-6 max-w-4xl rounded-lg border p-5"
        style={{
        backgroundColor: "#f8fffe",
         borderColor: "#99f6e4"
        }}
        >
       <p
        className="mb-5"
        style={{
        fontWeight: 700,
        color: "#111827",
        fontSize: "16px"
        }}
        >
        Recovery Coaching
        </p>
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm">
        <p style={{ fontWeight: 700, color: "#111827", fontSize: "15px" }}>
        Recovery Action
        </p>

        <p className="mt-3 mb-4 text-sm leading-6">
        {recoveryAction || "No recovery action selected"}
        </p>
        </div>

        <p className="mt-3 text-sm leading-6">{coaching}</p>

        <p className="mt-3 text-sm leading-6">
            {actionCoaching}
                </p>

        <div
        className="mt-6 rounded-lg border p-5"
        style={{
        backgroundColor: "#ecfeff",
        borderColor: "#f5fbff"
        }}
        >
          <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Recovery Prompts</p>

          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700">
            <li>What must still be true by the end of today?</li>
            <li>What can I stop, delegate, or simplify right now?</li>
            <li>Who needs clarity, support, or a decision before the day ends?</li>
          </ul>
        </div>
      </div>
    </div>
  );
}