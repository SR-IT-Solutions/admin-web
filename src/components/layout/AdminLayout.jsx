import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import SettingsModal from "../settings/SettingsModal";
import LoginScreen from "../auth/LoginScreen";
import UnlockScreen from "../settings/UnlockScreen";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { isConfigured, vaultExists, unlocked, forget } = useSettings();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  if (vaultExists && !unlocked) {
    return <UnlockScreen onForget={forget} />;
  }

  if (!vaultExists) {
    return <SettingsModal open forced onClose={() => setSettingsOpen(false)} />;
  }

  if (isConfigured && authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[13px] text-muted">
        Loading…
      </div>
    );
  }

  if (isConfigured && !isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen">
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

      <div className="pl-[230px]">
        <Outlet context={{ isConfigured }} />
      </div>

      <SettingsModal
        open={settingsOpen}
        forced={!isConfigured}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
