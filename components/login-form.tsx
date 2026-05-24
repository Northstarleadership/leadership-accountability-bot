"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/browser";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");

    const supabase = createClient();
    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setStatus("Account created. Check your email if confirmation is enabled in Supabase.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="login-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">{mode === "signin" ? "Sign in" : "Create account"}</p>
          <h2>Open your leadership dashboard</h2>
        </div>
      </div>
      <form className="form-stack" onSubmit={submit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            className="input"
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            className="input"
            id="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        {status ? <p className="success">{status}</p> : null}
        <button className="button" type="submit" disabled={loading}>
          {mode === "signin" ? <LogIn size={18} aria-hidden /> : <UserPlus size={18} aria-hidden />}
          {loading ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button
          className="button ghost"
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "Need an account?" : "Already have an account?"}
        </button>
      </form>
    </div>
  );
}
