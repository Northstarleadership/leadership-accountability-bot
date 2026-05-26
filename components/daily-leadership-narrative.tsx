import type { CheckIn } from "@/lib/types";

type DailyLeadershipNarrativeProps = {
  checkIns: CheckIn[];
};

export function DailyLeadershipNarrative({
  checkIns
}: DailyLeadershipNarrativeProps) {
  const today = new Date().toISOString().slice(0, 10);

  const todaysCheckIns = checkIns.filter(
    (checkIn) => checkIn.check_in_date === today
  );

  const morning = todaysCheckIns.find(
    (checkIn) => checkIn.phase === "morning"
  );

  const midday = todaysCheckIns.find(
    (checkIn) => checkIn.phase === "midday"
  );

  const endOfDay = todaysCheckIns.find(
    (checkIn) => checkIn.phase === "end_of_day"
  );

  const obstacle =
    morning?.obstacle_category || "execution friction";

  const behavior =
    morning?.leadership_behavior_category || "leadership discipline";

  const status =
    midday?.midday_status || "steady execution";

  const recovery =
    midday?.recovery_action || "continued forward progress";

  const lesson =
    endOfDay?.lesson || "continued reflection and adaptation";

  let narrative = `
You began the day anticipating ${obstacle.toLowerCase()} while intentionally focusing on ${behavior.toLowerCase()}.
`;

  if (status === "On track") {
    narrative += `
Midday signals suggested execution remained on track throughout the day.
`;
  }

  if (status === "Slightly off track") {
    narrative += `
By midday, execution drift began to emerge and required course correction.
`;
  }

  if (status === "Blocked") {
    narrative += `
Midday signals showed meaningful execution friction that interrupted momentum.
`;
  }

  if (status === "Need decision") {
    narrative += `
Progress slowed during the day because decisions or direction clarification were needed.
`;
  }

  if (status === "Need support") {
    narrative += `
The day revealed moments where support or alignment became necessary to sustain execution.
`;
  }

  narrative += `
Your chosen recovery action focused on ${recovery.toLowerCase()}, helping restore clarity and forward movement.
`;

  narrative += `
By the end of the day, your reflection suggested the key lesson was: "${lesson}".
`;

  narrative += `
This pattern suggests leadership growth is occurring through awareness, adjustment, and intentional execution recovery.
`;

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">
        Daily Leadership Narrative
      </h2>

      <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
        AI-generated interpretation of your leadership execution patterns throughout the day.
      </p>

      <div className="mt-6 rounded-lg border p-5">
        <p className="text-sm leading-7 whitespace-pre-line">
          {narrative}
        </p>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <p className="text-sm text-gray-500">
          Leadership Reflection
        </p>

        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>
            Where did execution drift begin today?
          </li>

          <li>
            Which leadership behavior had the greatest positive impact?
          </li>

          <li>
            What early signal should receive more attention tomorrow?
          </li>
        </ul>
      </div>
    </div>
  );
}