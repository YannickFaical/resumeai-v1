"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function signIn(email: string, password: string) {
  console.log("[SERVER ACTION signIn] start", email);
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("[SERVER ACTION signIn] error:", error.message);
    return { error: error.message };
  }

  console.log("[SERVER ACTION signIn] success, session:", data.session ? "present" : "missing");
  revalidatePath("/", "layout");
  return { success: true };
}

export async function signUp(
  email: string,
  password: string,
  fullName: string
) {
  console.log("[SERVER ACTION signUp] start", email);
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });

  if (error) {
    console.error("[SERVER ACTION signUp] error:", error.message);
    return { error: error.message };
  }

  console.log("[SERVER ACTION signUp] success, session:", data.session ? "present" : "missing");
  revalidatePath("/", "layout");
  return { success: true };
}
