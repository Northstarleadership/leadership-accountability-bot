import { AlertTriangle } from "lucide-react";
import type { CheckIn } from "@/lib/types";
import { getRecurringBlockerAnalysis } from "@/lib/dashboard";

export function BlockerList({ checkIns }: { checkIns: CheckIn[] }) {
  const blockers = getRecurringBlockerAnalysis(checkIns);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Blockers</p>
          <h2>Recurring friction</h2>
        </div>
        <AlertTriangle size={20} aria-hidden />
      </div>
      {blockers.length ? (
        <ul className="list">
          {blockers.map((blocker) => (
            <li key={blocker.label}>
              <strong>{blocker.label}</strong> <span className="muted">({blocker.count}, {blocker.risk})</span>
              <p className="muted list-note">{blocker.nextAction}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No blockers logged this week.</p>
      )}
    </section>
  );
}
