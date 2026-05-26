import { redirect } from "next/navigation";
import { Bot, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type {
  CheckIn,
  UserProfile,
  WeeklySummary,
  LeaderStandardWork as LeaderStandardWorkType
} from "@/lib/types";
import { CheckInForm } from "@/components/check-in-form";
import { DashboardStats } from "@/components/dashboard-stats";
import { CommitmentList } from "@/components/commitment-list";
import { BlockerList } from "@/components/blocker-list";
import { ReflectionSummary } from "@/components/reflection-summary";
import { SignOutButton } from "@/components/sign-out-button";
import { ExecutionScore } from "@/components/execution-score";
import { WeeklySummaryCard } from "@/components/weekly-summary-card";
import { createWeeklySummaryResponse } from "@/lib/openai";
import { ReminderSettings } from "@/components/reminder-settings";
import { ObstacleAnalytics } from "@/components/obstacle-analytics";
import { LeadershipBehaviorAnalytics } from "@/components/leadership-behavior-analytics";
import { MorningAlignmentInsight } from "@/components/morning-alignment-insight";
import { MiddayRecoveryCoaching } from "@/components/midday-recovery-coaching";
import { DailyAarReport } from "@/components/daily-aar-report";
import { DailyLeadershipNarrative } from "@/components/daily-leadership-narrative";
import { WeeklyLeadershipIntelligence } from "@/components/weekly-leadership-intelligence";
import { LeaderStandardWork } from "@/components/leader-standard-work";


export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const { data } = await supabase
    .from("check_ins")
    .select("*")
    .eq("user_id", user.id)
    .gte("check_in_date", since.toISOString().slice(0, 10))
    .order("created_at", { ascending: false });

  const { data: profileData } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: summaryData } = await supabase
    .from("weekly_summaries")
    .select("*")
    .eq("user_id", user.id)
    .order("week_start", { ascending: false })
    .limit(1)
    .maybeSingle();

    const { data: lswData } = await supabase
  .from("leader_standard_work")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });
  

  const checkIns = (data || []) as CheckIn[];
  const profile = profileData as UserProfile | null;
  const weeklySummary = summaryData as WeeklySummary | null; 
  const leaderStandardWork = (lswData || []) as LeaderStandardWorkType[];
  const aiWeeklySummary = await createWeeklySummaryResponse(checkIns);
  
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <Bot size={20} aria-hidden />
          </span>
          <span>Leadership Accountability App</span>
        </div>
        <SignOutButton icon={<LogOut size={18} aria-hidden />} />
      </header>
      <div className="container">
        <section className="section">
          <div className="section-header">
            <div>
              <p className="eyebrow">Today</p>
              <h1>Lead the day before the day leads you.</h1>
              <p className="muted">
                Capture the truth quickly, then choose the next action that keeps execution moving.
              </p>
            </div>
          </div>
          <DashboardStats checkIns={checkIns} />
        </section>

        <div className="page-grid">
          <div>
            <div className="space-y-6">
          <CheckInForm />
        <LeaderStandardWork items={leaderStandardWork} />
        <ObstacleAnalytics checkIns={checkIns} />
        <LeadershipBehaviorAnalytics checkIns={checkIns} />
        <MorningAlignmentInsight checkIns={checkIns} />
        <MiddayRecoveryCoaching checkIns={checkIns} />
        <DailyLeadershipNarrative checkIns={checkIns} />
            </div>
          </div>
          <aside>
            <ExecutionScore checkIns={checkIns} />
            <CommitmentList checkIns={checkIns} />
            <ReflectionSummary checkIns={checkIns} />
            <WeeklyLeadershipIntelligence checkIns={checkIns} />
            <DailyAarReport checkIns={checkIns} />

<ReminderSettings profile={profile} fallbackEmail={user.email} />
          </aside>
        </div>
      </div>
    </main>
  );
}
