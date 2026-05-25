import type { CheckIn } from "@/lib/types";

type DailyAarReportProps = {
  checkIns: CheckIn[];
};

export function DailyAarReport({ checkIns }: DailyAarReportProps) {
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

  const priorities = morning?.top_priorities?.filter(Boolean) || [];

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Daily Leadership AAR</h2>

      <p className="mt-1 text-sm text-gray-500">
        Review what was intended, what happened, what was learned, and what changes tomorrow.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">1. What was supposed to happen?</p>
          <p className="mt-2 text-sm leading-6">
            {priorities.length > 0
              ? priorities.join(", ")
              : "No morning priorities recorded yet."}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">2. What actually happened?</p>
          <p className="mt-2 text-sm leading-6">
            {endOfDay?.completed ||
              endOfDay?.not_done ||
              "No end-of-day outcome recorded yet."}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">3. What got in the way?</p>
          <p className="mt-2 text-sm leading-6">
            {morning?.obstacle_category ||
              midday?.midday_status ||
              midday?.blocked ||
              "No obstacle or friction recorded yet."}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">4. What recovery action was taken?</p>
          <p className="mt-2 text-sm leading-6">
            {midday?.recovery_action || "No recovery action recorded yet."}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">5. What was learned?</p>
          <p className="mt-2 text-sm leading-6">
            {endOfDay?.lesson || "No lesson learned recorded yet."}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">6. What will change tomorrow?</p>
          <p className="mt-2 text-sm leading-6">
            {endOfDay?.next_action || "No next action recorded yet."}
          </p>
        </div>
      </div>
    </div>
  );
}