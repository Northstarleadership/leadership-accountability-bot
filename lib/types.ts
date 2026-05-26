export type CheckInPhase = "morning" | "midday" | "end_of_day";

export type CheckIn = {
  id: string;
  user_id: string;
  phase: CheckInPhase;
  check_in_date: string;
  top_priorities: string[];
  obstacle: string | null;
  leadership_behavior: string | null;
  obstacle_category: string | null;
  leadership_behavior_category: string | null;
  midday_status: string | null;
  recovery_action: string | null;
  progress: string | null;
  blocked: string | null;
  support_needed: string | null;
  completed: string | null;
  not_done: string | null;
  lesson: string | null;
  next_action: string | null;
  ai_coaching: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  user_id: string;
  email: string | null;
  phone: string | null;
  email_reminders_enabled: boolean;
  sms_reminders_enabled: boolean;
  morning_reminder_time: string;
  midday_reminder_time: string;
  end_of_day_reminder_time: string;
  timezone: string;
  created_at: string;
  updated_at: string;
};

export type WeeklySummary = {
  id: string;
  user_id: string;
  week_start: string;
  week_end: string;
  execution_score: number;
  recurring_blockers: Array<{ label: string; count: number; risk: string; nextAction: string }>;
  summary: string;
  created_at: string;
};
export type LeaderStandardWork = {
  id: string;
  user_id: string;
  activity: string;
  frequency: string;
  category: string | null;
  notes: string | null;
  created_at: string;
};

export type CheckInPayload = {
  phase: CheckInPhase;
  topPriorities?: string[];
  middayStatus?: string;
  recoveryAction?: string;
  obstacle?: string;
  leadershipBehavior?: string;
  progress?: string;
  blocked?: string;
  supportNeeded?: string;
  completed?: string;
  notDone?: string;
  lesson?: string;
  nextAction?: string;
  obstacleCategory?: string;
  leadershipBehaviorCategory?: string;
};
