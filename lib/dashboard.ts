import type { CheckIn } from "@/lib/types";

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyCommitments(checkIns: CheckIn[]) {
  const today = getTodayKey();
  const morning = checkIns.find((item) => item.check_in_date === today && item.phase === "morning");
  const endOfDay = checkIns.find((item) => item.check_in_date === today && item.phase === "end_of_day");

  return {
    priorities: morning?.top_priorities.filter(Boolean) || [],
    completed: endOfDay?.completed || "",
    notDone: endOfDay?.not_done || ""
  };
}

export function getCompletionPercentage(checkIns: CheckIn[]) {
  const { priorities, completed, notDone } = getDailyCommitments(checkIns);
  if (priorities.length === 0) return 0;

  const completedText = completed.toLowerCase();
  const notDoneText = notDone.toLowerCase();
  const completedCount = priorities.filter((priority) => {
    const normalized = priority.toLowerCase();
    return completedText.includes(normalized) && !notDoneText.includes(normalized);
  }).length;

  return Math.round((completedCount / priorities.length) * 100);
}

export function getRecurringBlockers(checkIns: CheckIn[]) {
  const blockers = checkIns
    .flatMap((item) => [item.obstacle, item.blocked])
    .filter((value): value is string => Boolean(value && value.trim().length > 0));

  const counts = blockers.reduce<Record<string, number>>((acc, blocker) => {
    const key = blocker.trim().toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }));
}

export function getRecurringBlockerAnalysis(checkIns: CheckIn[]) {
  return getRecurringBlockers(checkIns).map((blocker) => {
    const risk =
      blocker.count >= 3
        ? "Pattern risk"
        : blocker.count === 2
          ? "Emerging pattern"
          : "Single signal";
    const nextAction =
      blocker.count >= 2
        ? "Make this visible in tomorrow's morning priority and name the decision owner."
        : "Watch for repeat friction before it becomes a pattern.";

    return {
      ...blocker,
      risk,
      nextAction
    };
  });
}

export function getExecutionScore(checkIns: CheckIn[]) {
  const completion = getCompletionPercentage(checkIns);
  const today = getTodayKey();
  const todaysCheckIns = checkIns.filter((item) => item.check_in_date === today);
  const checkInCoverage = Math.round((new Set(todaysCheckIns.map((item) => item.phase)).size / 3) * 100);
  const blockerPenalty = Math.min(getRecurringBlockers(checkIns).reduce((total, item) => total + item.count, 0) * 4, 24);
  const score = Math.round(completion * 0.55 + checkInCoverage * 0.35 + Math.max(0, 100 - blockerPenalty) * 0.1);

  return Math.max(0, Math.min(100, score));
}

export function getWeeklyReflectionSummary(checkIns: CheckIn[]) {
  const lessons = checkIns
    .filter((item) => item.phase === "end_of_day")
    .map((item) => item.lesson)
    .filter((value): value is string => Boolean(value && value.trim().length > 0))
    .slice(0, 5);

  if (lessons.length === 0) {
    return "No weekly reflection themes yet. Complete end-of-day reflections to build the summary.";
  }

  return lessons.join(" ");
}

export function getWeekBounds() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(now);
  start.setDate(now.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return {
    weekStart: start.toISOString().slice(0, 10),
    weekEnd: end.toISOString().slice(0, 10)
  };
}
