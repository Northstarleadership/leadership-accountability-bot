import type { CheckIn } from "@/lib/types";

type MorningAlignmentInsightProps = {
  checkIns: CheckIn[];
};

export function MorningAlignmentInsight({
  checkIns
}: MorningAlignmentInsightProps) {
  const morningCheckIns = checkIns.filter(
    (checkIn) =>
      checkIn.phase === "morning" &&
      checkIn.obstacle_category &&
      checkIn.leadership_behavior_category
  );

  const latestMorning = morningCheckIns[0];

  if (!latestMorning) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Morning Alignment Insight</h2>
        <p className="mt-2 text-sm text-gray-500">
          Complete a morning check-in to see how your selected obstacle and leadership behavior align.
        </p>
      </div>
    );
  }

  const obstacle = latestMorning.obstacle_category;
  const behavior = latestMorning.leadership_behavior_category;

  let insight =
    "Your selected obstacle and leadership behavior create a useful signal for the day. Use the behavior intentionally to reduce execution friction.";

  if (obstacle === "Interruptions" && behavior === "Accountability") {
    insight =
      "Interruptions are showing up while Accountability is your chosen behavior. Consider setting clearer availability boundaries and naming ownership before the day begins.";
  }

  if (obstacle === "Interruptions" && behavior === "Prioritization") {
    insight =
      "Interruptions may pull attention away from your top priorities. Use Prioritization to protect focus time and reduce reactive work.";
  }

  if (obstacle === "Waiting on someone" && behavior === "Communication") {
    insight =
      "Waiting on someone may slow execution today. Use Communication to clarify expectations, decision owners, and follow-up timing early.";
  }

  if (obstacle === "Too many meetings" && behavior === "Decisiveness") {
    insight =
      "Too many meetings may create decision drag. Use Decisiveness to clarify what must be decided, by whom, and by when.";
  }

  if (obstacle === "Lack of time" && behavior === "Delegation") {
    insight =
      "Time pressure may limit execution today. Use Delegation to move ownership closer to the work and reduce unnecessary load.";
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
     <h2 style={{ fontWeight: 800, color: "#111827", fontSize: "24px" }}>
  Morning Alignment Insight
</h2>

      <p className="mt-1 text-sm text-gray-500">
        Connect today’s likely obstacle with the leadership behavior you intend to practice.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
         <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Likely Obstacle</p>
          <p className="mt-1 text-lg font-semibold">{obstacle}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Leadership Behavior</p>
          <p className="mt-1 text-lg font-semibold">{behavior}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-4">
  <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Coaching Signal</p>

  <p className="mt-2 text-sm leading-6">{insight}</p>

  <div className="mt-4">
    <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
      Reflection Prompts
    </p>

    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-700">
      <li>
        What action can I take early today to reduce this obstacle before it grows?
      </li>

      <li>
        How can I intentionally demonstrate this leadership behavior during a difficult moment?
      </li>

      <li>
        What conversation, clarification, or decision would most improve execution today?
      </li>
    </ul>
  </div>
</div>
    </div>
  );
}