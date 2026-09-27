import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "./SettingsContext";
import { getSupabaseClient } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { settings, isConfigured, forget } = useSettings();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const client = isConfigured ? getSupabaseClient(settings) : null;

  useEffect(() => {
    if (!client) {
      setSession(null);
      setLoading(false);
      return;
    }

    let active = true;
    let settled = false;

    const resolve = async () => {
      const { data } = await client.auth.getSession();
      if (!active) return;

      if (data.session) {
        setSession(data.session);
        settled = true;
        setLoading(false);
        return;
      }

      if (settings.adminEmail && settings.adminPassword) {
        const { data: signedIn } = await client.auth.signInWithPassword({
          email: settings.adminEmail,
          password: settings.adminPassword,
        });
        if (!active) return;
        setSession(signedIn?.session ?? null);
        settled = true;
        setLoading(false);
        return;
      }

      setSession(null);
      settled = true;
      setLoading(false);
    };

    resolve();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      if (!settled && !nextSession) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client, settings.adminEmail, settings.adminPassword]);

  const signIn = async (email, password) => {
    if (!client)
      throw new Error("Add your Supabase details in Settings first.");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    try {
      if (client) await client.auth.signOut();
    } catch {
      setSession(null);
    }
    forget();
    setSession(null);
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const value = {
    session,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
