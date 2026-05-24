"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/browser";

export function SignOutButton({ icon }: { icon: ReactNode }) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="button secondary" type="button" onClick={signOut}>
      {icon}
      Sign out
    </button>
  );
}
