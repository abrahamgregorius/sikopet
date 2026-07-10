import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== "placeholder.supabase.co" &&
  !supabaseUrl.includes("your-project-id");

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!isConfigured) {
  console.warn(
    "[SIKOPET] Supabase not configured. Auth is disabled. " +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable login."
  );
}

export async function signIn({ email, password }) {
  if (!supabase) {
    return {
      data: { user: null, session: null },
      error: new Error(
        "Supabase belum dikonfigurasi. Hubungi administrator untuk mengatur koneksi database."
      ),
    };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUp({ email, password, name }) {
  if (!supabase) {
    return {
      data: { user: null, session: null },
      error: new Error(
        "Supabase belum dikonfigurasi. Hubungi administrator untuk mengatur koneksi database."
      ),
    };
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  return { data, error };
}

export async function signOut() {
  if (!supabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  if (!supabase) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword({ email }) {
  if (!supabase) {
    return { data: null, error: new Error("Supabase not configured") };
  }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { data, error };
}
