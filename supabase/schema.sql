create extension if not exists "pgcrypto";

create table if not exists public.check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phase text not null check (phase in ('morning', 'midday', 'end_of_day')),
  check_in_date date not null default current_date,
  top_priorities text[] not null default '{}',
  obstacle text,
  leadership_behavior text,
  progress text,
  blocked text,
  support_needed text,
  completed text,
  not_done text,
  lesson text,
  next_action text,
  ai_coaching text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists check_ins_user_date_idx
  on public.check_ins (user_id, check_in_date desc, created_at desc);

create index if not exists check_ins_user_phase_idx
  on public.check_ins (user_id, phase);

alter table public.check_ins enable row level security;

drop policy if exists "Users can read their own check-ins" on public.check_ins;
create policy "Users can read their own check-ins"
  on public.check_ins
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own check-ins" on public.check_ins;
create policy "Users can create their own check-ins"
  on public.check_ins
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own check-ins" on public.check_ins;
create policy "Users can update their own check-ins"
  on public.check_ins
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own check-ins" on public.check_ins;
create policy "Users can delete their own check-ins"
  on public.check_ins
  for delete
  using (auth.uid() = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists check_ins_set_updated_at on public.check_ins;

create trigger check_ins_set_updated_at
before update on public.check_ins
for each row
execute function public.set_updated_at();

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  email_reminders_enabled boolean not null default true,
  sms_reminders_enabled boolean not null default false,
  morning_reminder_time time not null default '08:00',
  midday_reminder_time time not null default '12:00',
  end_of_day_reminder_time time not null default '17:00',
  timezone text not null default 'America/New_York',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_summaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  week_end date not null,
  execution_score integer not null check (execution_score between 0 and 100),
  recurring_blockers jsonb not null default '[]'::jsonb,
  summary text not null,
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table if not exists public.reminder_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phase text not null check (phase in ('morning', 'midday', 'end_of_day')),
  channel text not null check (channel in ('email', 'sms')),
  sent_at timestamptz not null default now(),
  status text not null default 'sent'
);

create index if not exists weekly_summaries_user_week_idx
  on public.weekly_summaries (user_id, week_start desc);

create index if not exists reminder_logs_user_sent_idx
  on public.reminder_logs (user_id, sent_at desc);

alter table public.user_profiles enable row level security;
alter table public.weekly_summaries enable row level security;
alter table public.reminder_logs enable row level security;

drop policy if exists "Users can read their own profile" on public.user_profiles;
create policy "Users can read their own profile"
  on public.user_profiles
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can upsert their own profile" on public.user_profiles;
create policy "Users can upsert their own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own profile" on public.user_profiles;
create policy "Users can update their own profile"
  on public.user_profiles
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own weekly summaries" on public.weekly_summaries;
create policy "Users can read their own weekly summaries"
  on public.weekly_summaries
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own weekly summaries" on public.weekly_summaries;
create policy "Users can create their own weekly summaries"
  on public.weekly_summaries
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own weekly summaries" on public.weekly_summaries;
create policy "Users can update their own weekly summaries"
  on public.weekly_summaries
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can read their own reminder logs" on public.reminder_logs;
create policy "Users can read their own reminder logs"
  on public.reminder_logs
  for select
  using (auth.uid() = user_id);

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;

create trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row
execute function public.set_updated_at();
