"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth server actions backing the existing /login and /signup forms.
 *
 * These return an error string rather than throwing so the forms can render
 * the message inline, matching the client-side validation UI already there.
 */

export interface AuthResult {
  error?: string;
}

function safeNext(next: string | undefined): string {
  // Only ever redirect within this app — an absolute URL here would be an open
  // redirect straight out of the login form.
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/dashboard";
  return next;
}

export async function signIn(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next")?.toString());

  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase returns the same message for a wrong password and an unknown
    // address, which is the behaviour we want: it does not reveal whether an
    // account exists.
    return { error: "That email and password do not match an account." };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!email || !password) return { error: "Enter your email and password." };
  if (password.length < 8) return { error: "Use at least 8 characters." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Read by the handle_new_user trigger to seed profiles.name.
    options: { data: { name } },
  });

  if (error) return { error: error.message };

  // With email confirmation on, signUp succeeds but no session is returned.
  if (!data.session) {
    return { error: "Check your inbox to confirm your address, then log in." };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
