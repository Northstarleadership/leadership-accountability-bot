"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { WeeklySummary } from "@/lib/types";
type WeeklySummaryCardProps = {
  summary: WeeklySummary | null;
  aiSummary?: string;
};

export function WeeklySummaryCard({summary,aiSummary
}: WeeklySummaryCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");

    const response = await fetch("/api/weekly-summary", {
      method: "POST"
    });

    const body = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(body.error || "Unable to generate weekly summary.");
      return;
    }

    router.refresh();
  }

  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Weekly</p>
          <h2>AI leadership summary</h2>
        </div>
        <button className="button secondary" type="button" onClick={generate} disabled={loading}>
          <Sparkles size={18} aria-hidden />
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
      {error ? <p className="error">{error}</p> : null}
      {summary ? (
        <>
          <p className="muted">
            Week of {summary.week_start} through {summary.week_end}. Score: {summary.execution_score}
          </p>
          <div className="coach-box">{summary.summary}</div>
         {aiSummary && (
  <div className="coach-box" style={{ marginTop: "1rem" }}>
    <p className="eyebrow">AI Weekly Insight</p>
    <div className="muted whitespace-pre-wrap">
      {aiSummary}
    </div>
  </div>
)}
        </>
      ) : (
        <p className="muted">Generate a weekly summary once you have check-ins for the week.</p>
      )}
    </section>
  );
}
