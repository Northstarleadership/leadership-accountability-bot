import { BookOpenText } from "lucide-react";
import type { CheckIn } from "@/lib/types";
import { getWeeklyReflectionSummary } from "@/lib/dashboard";

export function ReflectionSummary({ checkIns }: { checkIns: CheckIn[] }) {
  return (
    <section className="section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Reflection</p>
          <h2>Weekly leadership theme</h2>
        </div>
        <BookOpenText size={20} aria-hidden />
      </div>
      <p className="muted">{getWeeklyReflectionSummary(checkIns)}</p>
    </section>
  );
}
