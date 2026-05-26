import { BookOpenText } from "lucide-react";
import type { CheckIn } from "@/lib/types";
import { getWeeklyReflectionSummary } from "@/lib/dashboard";

function getWeeklyTheme(checkIns: CheckIn[] = []) {
  const obstacleCounts = checkIns.reduce<Record<string, number>>((acc, item) => {
    if (item.obstacle_category) {
      acc[item.obstacle_category] = (acc[item.obstacle_category] || 0) + 1;
    }
    return acc;
  }, {});

  const topObstacle = Object.entries(obstacleCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  if (topObstacle === "Interruptions") return "Protecting Focus";
  if (topObstacle === "Waiting on someone") return "Accountability Loops";
  if (topObstacle === "Too many meetings") return "Reducing Decision Drag";
  if (topObstacle === "Lack of time") return "Simplifying Priorities";
  if (topObstacle === "Unclear priority") return "Clarifying Direction";

  return "Leadership Learning";
}

export function ReflectionSummary({ checkIns }: { checkIns: CheckIn[] }) {
  const theme = getWeeklyTheme(checkIns);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Reflection</p>
          <h2>{theme}</h2>
        </div>
        <BookOpenText size={20} aria-hidden />
      </div>

      <p className="muted">{getWeeklyReflectionSummary(checkIns)}</p>
    </section>
  );
}
