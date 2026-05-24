# Leadership Accountability Bot

An MVP web app that helps business owners and leaders convert strategy into daily execution through structured check-ins, reflection, action tracking, and AI coaching.

## Stack

- Next.js App Router
- React
- Supabase Auth and Postgres
- OpenAI Responses API
- Responsive CSS

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example` and fill in your keys.

3. Run the Supabase SQL in [supabase/schema.sql](supabase/schema.sql).

4. Start the app:

```bash
npm run dev
```

## Core Flow

- Sign up or sign in with email and password.
- Complete morning, midday, and end-of-day check-ins.
- Each check-in receives a direct, practical AI coaching response.
- Dashboard tracks daily commitments, completion percentage, recurring blockers, and weekly leadership reflection themes.
- Generate weekly AI summaries with execution score, wins, gaps, recurring blockers, and next week's focus.
- Configure email and SMS reminders for morning, midday, and end-of-day accountability prompts.

## OpenAI Integration

Server route handlers call the official OpenAI JavaScript SDK using `client.responses.create(...)`, following the current OpenAI API quickstart pattern.

## Reminder Integrations

The app includes reminder settings and a cron-ready route at `/api/reminders/send`.

- Email reminders use the Resend HTTP API when `RESEND_API_KEY` and `REMINDER_FROM_EMAIL` are set.
- SMS reminders use the Twilio HTTP API when `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_FROM_PHONE` are set.
- Set `CRON_SECRET` and call the route with `Authorization: Bearer <CRON_SECRET>`.
- `vercel.json` schedules the reminder route every 30 minutes for Vercel Cron.

## Vercel Deployment

1. Push the project to GitHub.
2. Import it into Vercel as a Next.js project.
3. Add all variables from `.env.example` to Vercel Project Settings.
4. Run `supabase/schema.sql` in your Supabase SQL editor.
5. Deploy.

Public deployment depends on real Supabase, OpenAI, email, and SMS credentials being configured in Vercel.
