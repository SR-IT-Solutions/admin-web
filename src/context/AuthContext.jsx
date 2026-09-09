import { createContext, useContext, useEffect, useState } from "react";
import { useSettings } from "./SettingsContext";
import { getSupabaseClient } from "../lib/supabaseClient";

const AuthContext = createContext(null);

/**
 * Tracks the Supabase auth session. Writes to `products` are restricted to
 * the `authenticated` role by RLS, so an admin must sign in before the
 * catalog can be edited.
 */
export function AuthProvider({ children }) {
  const { settings, isConfigured } = useSettings();
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

    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [client]);

  const signIn = async (email, password) => {
    if (!client) throw new Error("Add your Supabase details in Settings first.");
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    if (!client) return;
    await client.auth.signOut();
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
