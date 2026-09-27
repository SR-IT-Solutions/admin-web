import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { MobileBottomNav } from "./MobileNav";
import SettingsModal from "../settings/SettingsModal";
import UnlockScreen from "../settings/UnlockScreen";
import { useSettings } from "../../context/SettingsContext";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { settings, isConfigured, vaultExists, unlocked, forget } =
    useSettings();
  const { loading: authLoading } = useAuth();

  const hasCredentials = Boolean(
    settings.adminEmail && settings.adminPassword,
  );

  if (vaultExists && !unlocked) {
    return <UnlockScreen onForget={forget} />;
  }

  if (!vaultExists || !hasCredentials) {
    return <SettingsModal open />;
  }

  if (isConfigured && authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[13px] text-muted">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <div className="pb-16 md:pb-0 md:pl-57.5">
        <Outlet context={{ isConfigured }} />
      </div>

      <MobileBottomNav />
    </div>
  );
}
