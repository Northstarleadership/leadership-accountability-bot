import { Gauge } from "lucide-react";
import type { CheckIn } from "@/lib/types";
import { getExecutionScore } from "@/lib/dashboard";

export function ExecutionScore({ checkIns }: { checkIns: CheckIn[] }) {
  const score = getExecutionScore(checkIns);

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Execution</p>
          <h2>Leadership execution score</h2>
        </div>
        <Gauge size={20} aria-hidden />
      </div>
      <span className="stat-value">{score}</span>
      <p className="muted">
        Blends completion, check-in consistency, and blocker friction into a simple weekly signal.
      </p>
    </section>
  );
}
