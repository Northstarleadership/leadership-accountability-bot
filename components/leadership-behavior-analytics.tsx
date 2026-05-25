import type { CheckIn } from "@/lib/types";

type LeadershipBehaviorAnalyticsProps = {
  checkIns: CheckIn[];
};

export function LeadershipBehaviorAnalytics({
  checkIns
}: LeadershipBehaviorAnalyticsProps) {
  const behaviorCheckIns = checkIns.filter(
    (checkIn) =>
      checkIn.leadership_behavior_category &&
      checkIn.leadership_behavior_category !== "none"
  );

  const behaviorCounts = behaviorCheckIns.reduce<Record<string, number>>(
    (acc, checkIn) => {
      const behavior =
        checkIn.leadership_behavior_category || "Uncategorized";
      acc[behavior] = (acc[behavior] || 0) + 1;
      return acc;
    },
    {}
  );

  const sortedBehaviors = Object.entries(behaviorCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const maxCount = Math.max(...sortedBehaviors.map(([, count]) => count), 1);

  const topBehavior =
    sortedBehaviors[0]?.[0] || "No leadership behavior pattern yet";

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Leadership Behavior Analytics</h2>

      <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
        Track which leadership behaviors you are intentionally practicing.
      </p>

      <div className="mt-6 rounded-lg border p-4">
        <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Most Practiced Behavior</p>
        <p className="mt-1 text-lg font-semibold">{topBehavior}</p>
      </div>

      <div className="mt-6 space-y-3">
       <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Behavior Trend Bars</p>

        {sortedBehaviors.length === 0 ? (
          <p className="text-sm text-gray-500">
            No leadership behavior patterns have been recorded yet.
          </p>
        ) : (
          sortedBehaviors.map(([behavior, count]) => {
            const percentage = Math.round((count / maxCount) * 100);

            return (
              <div key={behavior} className="space-y-1">
                <div className="text-sm font-medium">
                  {behavior} - {count}
                </div>

                <div
                  style={{
                    width: "100%",
                    height: "14px",
                    backgroundColor: "#e5e7eb",
                    borderRadius: "999px",
                    overflow: "hidden"
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      minWidth: "18px",
                      height: "14px",
                      backgroundColor: "#2563eb",
                      borderRadius: "999px"
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <p className="text-sm text-gray-500">Leadership Coaching Insight</p>

        <p className="mt-2 text-sm leading-6">
          {topBehavior === "Accountability" &&
            "Accountability is showing up as a recurring leadership behavior. Keep connecting ownership, follow-through, and clear expectations."}

          {topBehavior === "Delegation" &&
            "Delegation is becoming a leadership pattern. Continue clarifying outcomes while giving others room to own the work."}

          {topBehavior === "Communication" &&
            "Communication is a recurring leadership focus. Keep reinforcing clarity, alignment, and timely feedback loops."}

          {topBehavior === "Prioritization" &&
            "Prioritization is showing up as a core leadership behavior. Continue protecting focus and reducing low-value activity."}

          {topBehavior !== "Accountability" &&
            topBehavior !== "Delegation" &&
            topBehavior !== "Communication" &&
            topBehavior !== "Prioritization" &&
            topBehavior !== "No leadership behavior pattern yet" &&
            "A leadership behavior pattern is emerging. Continue practicing it intentionally and look for how it affects execution friction."}

          {topBehavior === "No leadership behavior pattern yet" &&
            "No leadership behavior trend has been detected yet. Continue using the morning check-in to identify the behavior you want to practice."}
        </p>
      </div>
    </div>
  );
}