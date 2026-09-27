import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { clearVault, hasVault, openVault, saveVault } from "../lib/vault";

export const EMPTY_SETTINGS = {
  supabaseUrl: "",
  supabaseKey: "",
  cloudName: "",
  uploadPreset: "",
  adminEmail: "",
  adminPassword: "",
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(EMPTY_SETTINGS);
  const [unlocked, setUnlocked] = useState(false);
  const [vaultExists, setVaultExists] = useState(() => hasVault());

  const unlock = useCallback(async (passphrase) => {
    const stored = await openVault(passphrase);
    if (!stored) return false;
    setSettings({ ...EMPTY_SETTINGS, ...stored });
    setUnlocked(true);
    return true;
  }, []);

  const saveSettings = useCallback(async (next, passphrase) => {
    await saveVault(next, passphrase);
    setSettings(next);
    setUnlocked(true);
    setVaultExists(true);
  }, []);

  const forget = useCallback(() => {
    clearVault();
    setSettings(EMPTY_SETTINGS);
    setUnlocked(false);
    setVaultExists(false);
  }, []);

  const isConfigured = useMemo(
    () => Boolean(settings.supabaseUrl && settings.supabaseKey),
    [settings],
  );

  const isCloudinaryConfigured = useMemo(
    () => Boolean(settings.cloudName && settings.uploadPreset),
    [settings],
  );

  const value = {
    settings,
    saveSettings,
    unlock,
    forget,
    unlocked,
    vaultExists,
    isConfigured,
    isCloudinaryConfigured,
  };

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
