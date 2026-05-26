import type { CheckIn } from "@/lib/types";

type ObstacleAnalyticsProps = {
  checkIns: CheckIn[];
};

export function ObstacleAnalytics({ checkIns }: ObstacleAnalyticsProps) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const obstacleCheckIns = checkIns.filter(
    (checkIn) =>
      checkIn.obstacle_category &&
      checkIn.obstacle_category !== "none"
  );

  const dailyCount = obstacleCheckIns.filter((checkIn) =>
    checkIn.created_at?.startsWith(today)
  ).length;

  const weeklyCount = obstacleCheckIns.filter(
    (checkIn) => new Date(checkIn.created_at) >= startOfWeek
  ).length;

  const monthlyCount = obstacleCheckIns.filter(
    (checkIn) => new Date(checkIn.created_at) >= startOfMonth
  ).length;

  const categoryCounts = obstacleCheckIns.reduce<Record<string, number>>(
    (acc, checkIn) => {
      const category = checkIn.obstacle_category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {}
  );

  const sortedCategories = Object.entries(categoryCounts).sort(
    (a, b) => b[1] - a[1]
  );

  const maxCount = Math.max(...sortedCategories.map(([, count]) => count), 1);

  const topObstacle =
    sortedCategories[0]?.[0] || "No recurring blocker yet";

  const frictionMessage =
    weeklyCount >= 6
      ? "Execution friction is trending upward."
      : weeklyCount >= 3
      ? "Execution friction is worth watching."
      : weeklyCount > 0
      ? "Execution friction is currently stable."
      : "No execution friction detected yet.";

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Obstacle Analytics</h2>

      <p className="mt-1 text-sm text-gray-500">
        Track how often obstacles are getting in the way of leadership execution.
      </p>

      <div className="mt-4 rounded-lg border p-4">
       <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Friction Signal</p>
        <p className="mt-1 text-lg font-semibold">{frictionMessage}</p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
         <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Today</p>
          <p className="text-3xl font-bold">{dailyCount}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>This Week</p>
          <p className="text-3xl font-bold">{weeklyCount}</p>
        </div>

        <div className="rounded-lg border p-4">
         <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>This Month</p>
          <p className="text-3xl font-bold">{monthlyCount}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Most Common Blocker</p>
        <p className="mt-1 text-lg font-semibold">{topObstacle}</p>
      </div>

      <div className="mt-6 space-y-3">
        <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>Obstacle Trend Bars</p>

        {sortedCategories.length === 0 ? (
          <p className="text-sm text-gray-500">
            No obstacle patterns have been recorded yet.
          </p>
        ) : (
          sortedCategories.map(([category, count]) => {
            const percentage = Math.round((count / maxCount) * 100);

            return (
              <div key={category} className="space-y-1">
                <div className="text-sm font-medium">
                    {category} - {count}
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
                    backgroundColor: "#0f766e",
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
        <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>AI Coaching Insight</p>

        <p className="mt-2 text-sm leading-6">
            {topObstacle === "Interruptions" &&
            "Interruptions are repeatedly affecting execution. Consider protecting focus blocks, reducing reactive work, and clarifying response expectations with your team."}

            {topObstacle === "Too many meetings" &&
            "Meeting overload is creating execution friction. Consider shortening meetings, tightening agendas, and protecting decision-making time."}

            {topObstacle === "Waiting on someone" &&
            "Dependency delays are slowing execution. Clarify ownership earlier and establish tighter follow-up loops."}

            {topObstacle === "Lack of time" &&
            "Time pressure is becoming a recurring blocker. Consider simplifying priorities and reducing low-value commitments."}

            {topObstacle !== "Interruptions" &&
            topObstacle !== "Too many meetings" &&
            topObstacle !== "Waiting on someone" &&
            topObstacle !== "Lack of time" &&
            topObstacle !== "No recurring blocker yet" &&
            "Recurring execution friction has been detected. Consider reviewing team alignment, prioritization, and accountability rhythms."}

            {topObstacle === "No recurring blocker yet" &&
            "No recurring execution blockers detected yet. Continue building consistent leadership execution habits."}
            </p>
        </div>
    </div>
  );
}