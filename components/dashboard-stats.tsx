import { CheckCircle2, ClipboardList } from "lucide-react";
import type { CheckIn } from "@/lib/types";
import { getCompletionPercentage, getDailyCommitments } from "@/lib/dashboard";

export function DashboardStats({ checkIns }: { checkIns: CheckIn[] }) {
  const completion = getCompletionPercentage(checkIns);
  const commitments = getDailyCommitments(checkIns);

  return (
    <div className="stats-grid">
      <div className="stat">
        <ClipboardList size={20} aria-hidden />
        <span className="stat-value">{commitments.priorities.length}</span>
        <span className="muted">Daily commitments</span>
      </div>
      <div className="stat">
        <CheckCircle2 size={20} aria-hidden />
        <span className="stat-value">{completion}%</span>
        <span className="muted">Completion estimate</span>
      </div>
    </div>
  );
}
