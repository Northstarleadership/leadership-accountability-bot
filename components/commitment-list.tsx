import { Target } from "lucide-react";
import type { CheckIn } from "@/lib/types";
import { getDailyCommitments } from "@/lib/dashboard";

export function CommitmentList({ checkIns }: { checkIns: CheckIn[] }) {
  const commitments = getDailyCommitments(checkIns);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Commitments</p>
          <h2>Today&apos;s top three</h2>
        </div>
        <Target size={20} aria-hidden />
      </div>
      {commitments.priorities.length ? (
        <ul className="list">
          {commitments.priorities.map((priority) => (
            <li key={priority}>{priority}</li>
          ))}
        </ul>
      ) : (
        <p className="muted">No morning commitments yet.</p>
      )}
    </section>
  );
}
