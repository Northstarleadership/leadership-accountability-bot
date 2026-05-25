import type { CheckIn } from "@/lib/types";

type WeeklyLeadershipIntelligenceProps = {
  checkIns: CheckIn[];
};

export function WeeklyLeadershipIntelligence({
  checkIns
}: WeeklyLeadershipIntelligenceProps) {
  const obstacleCounts = checkIns.reduce<Record<string, number>>((acc, checkIn) => {
    const obstacle = checkIn.obstacle_category;

    if (obstacle) {
      acc[obstacle] = (acc[obstacle] || 0) + 1;
    }

    return acc;
  }, {});

  const behaviorCounts = checkIns.reduce<Record<string, number>>((acc, checkIn) => {
    const behavior = checkIn.leadership_behavior_category;

    if (behavior) {
      acc[behavior] = (acc[behavior] || 0) + 1;
    }

    return acc;
  }, {});

  const recoveryCounts = checkIns.reduce<Record<string, number>>((acc, checkIn) => {
    const recovery = checkIn.recovery_action;

    if (recovery) {
      acc[recovery] = (acc[recovery] || 0) + 1;
    }

    return acc;
  }, {});

  const topObstacle =
    Object.entries(obstacleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No recurring obstacle";

  const topBehavior =
    Object.entries(behaviorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No recurring leadership behavior";

  const topRecovery =
    Object.entries(recoveryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "No recurring recovery action";

  const blockerCount = Object.values(obstacleCounts).reduce(
    (total, count) => total + count,
    0
  );

  const recoveryCount = Object.values(recoveryCounts).reduce(
    (total, count) => total + count,
    0
  );

  let intelligence =
    "This week does not have enough leadership pattern data yet. Continue completing morning, midday, and end-of-day check-ins so the system can identify meaningful trends.";

  if (blockerCount > 0) {
    intelligence = `This week shows recurring execution friction around ${topObstacle.toLowerCase()}. Your most practiced leadership behavior was ${topBehavior.toLowerCase()}, and your most common recovery action was ${topRecovery.toLowerCase()}.`;
  }

  if (blockerCount >= 3 && recoveryCount >= 2) {
    intelligence +=
      " The pattern suggests you are not only identifying friction, but also beginning to intervene during the day rather than waiting until the end-of-day reflection.";
  }

  if (blockerCount >= 5) {
    intelligence +=
      " Execution friction appears elevated this week, which may indicate the need to simplify priorities, clarify ownership, or protect focus time earlier in the day.";
  }

  if (topObstacle === "Interruptions" && topBehavior === "Prioritization") {
    intelligence +=
      " There is a useful signal here: interruptions are showing up while prioritization is being practiced. This suggests the leader may be actively working to protect focus against reactive demands.";
  }

  if (topObstacle === "Waiting on someone" && topBehavior === "Accountability") {
    intelligence +=
      " Waiting-on-someone blockers paired with accountability behavior suggest a need for clearer ownership, faster follow-up loops, and earlier decision visibility.";
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">
        Weekly Leadership Intelligence
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Cross-day pattern recognition based on obstacles, behaviors, and recovery actions.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
            Top Obstacle</p>
            <p className="mt-1 text-lg font-semibold">{topObstacle}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
            Top Behavior</p>
            <p className="mt-1 text-lg font-semibold">{topBehavior}</p>
        </div>

        <div className="rounded-lg border p-4">
          <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
            Top Recovery</p>
          <p className="mt-1 text-lg font-semibold">{topRecovery}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border p-4">
        <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
            Intelligence Summary</p>
        <p className="mt-2 text-sm leading-6">{intelligence}</p>
      </div>

      <div className="mt-6 rounded-lg border p-4">
       <p style={{ fontWeight: 800, color: "#111827", fontSize: "16px" }}>
        Leadership Questions</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700">
          <li>What pattern repeated most often this week?</li>
          <li>Where did execution drift begin?</li>
          <li>What behavior helped restore momentum?</li>
          <li>What should be simplified, clarified, or protected next week?</li>
        </ul>
      </div>
    </div>
  );
}