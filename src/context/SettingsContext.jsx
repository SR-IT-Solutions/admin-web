import { createContext, useContext, useState, useCallback, useMemo } from "react";

const SETTINGS_KEY = "catalog_admin_settings";

// Baked-in fallback values, read from build-time env vars. These are only
// used the very first time the app runs, before the user saves their own
// values from the Settings screen (which are then kept in localStorage).
const DEFAULT_SETTINGS = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || "",
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "",
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "",
};

function readStoredSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(
    () => readStoredSettings() || DEFAULT_SETTINGS
  );

  const saveSettings = useCallback((next) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    setSettings(next);
  }, []);

  const isConfigured = useMemo(
    () => Boolean(settings.supabaseUrl && settings.supabaseKey),
    [settings]
  );

  const isCloudinaryConfigured = useMemo(
    () => Boolean(settings.cloudName && settings.uploadPreset),
    [settings]
  );

  const value = { settings, saveSettings, isConfigured, isCloudinaryConfigured };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
