import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Header({ onOpenSettings }) {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border bg-panel px-8 py-5">
      <div>
        <h1 className="text-[19px] font-semibold leading-none">Catalog Admin</h1>
        <div className="mt-1 text-[13px] text-muted">
          {user?.email ? `Signed in as ${user.email}` : "Manage your product catalog"}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          title="Settings"
          className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted hover:bg-bg"
        >
          <Settings size={17} />
        </button>
        <button
          type="button"
          onClick={signOut}
          title="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted hover:bg-bg"
        >
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}
