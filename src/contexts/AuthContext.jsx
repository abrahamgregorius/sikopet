/** @format */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getSession, getUser, clearSession, setSession } from "../lib/auth";
import { isOnline } from "../lib/offline";
import { supabase } from "../lib/supabase";
import { db } from "../database/index.js";
import { fullSync, startAutoSync, stopAutoSync } from "../lib/syncService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const savedUser = getUser();
    const savedSession = getSession();
    if (savedUser && savedSession?.accessToken) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async ({ email, password }) => {
    if (!isOnline()) {
      return {
        error: new Error("Tidak bisa login offline. Pastikan koneksi internet aktif."),
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      return { error: error || new Error("Login gagal.") };
    }

    const { data: profileData, error: profileError } = await supabase
      .from("user")
      .select("*")
      .eq("id", data.user.id)
      .single();

    const userData = profileError
      ? {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || email.split("@")[0],
          role: "operator",
          cooperativeId: null,
        }
      : {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role,
          cooperativeId: profileData.cooperative_id,
        };

    setSession({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: userData,
    });

    await db.users.put(userData);
    setUser(userData);

    if (isOnline()) {
      await fullSync();
      startAutoSync(30000);
    }

    return { user: userData };
  }, []);

  const logout = useCallback(async () => {
    stopAutoSync();
    if (supabase) {
      await supabase.auth.signOut();
    }
    clearSession();
    setUser(null);
  }, []);

  const refreshSession = useCallback(async () => {
    if (!supabase || !isOnline()) return false;
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data?.session) return false;

    setSession({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user,
    });
    return true;
  }, [user]);

  const value = {
    user,
    loading,
    online,
    login,
    logout,
    refreshSession,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
