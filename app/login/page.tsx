import { Bot, CheckCircle2, Target } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <main className="container">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Leadership Accountability Bot</p>
          <h1>Turn leadership intent into daily execution.</h1>
          <p className="muted">
            Capture priorities, surface blockers, and get practical coaching at the exact points where
            leaders tend to drift: morning focus, midday decisions, and end-of-day reflection.
          </p>
          <ul className="list" aria-label="App benefits">
            <li>
              <Target size={18} aria-hidden /> Daily top-three commitment tracking
            </li>
            <li>
              <CheckCircle2 size={18} aria-hidden /> Completion and blocker visibility
            </li>
            <li>
              <Bot size={18} aria-hidden /> Direct AI coaching after every check-in
            </li>
          </ul>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
