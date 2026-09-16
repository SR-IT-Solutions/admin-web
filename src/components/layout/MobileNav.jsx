import { NavLink } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { TABS } from "./Sidebar";

export function MobileTopBar({ onOpenSettings }) {
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-panel px-4 py-3 md:hidden">
      <h1 className="text-[15px] font-semibold leading-none">Catalog Admin</h1>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Settings"
          className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted"
        >
          <Settings size={16} />
        </button>
        <button
          type="button"
          onClick={signOut}
          aria-label="Sign out"
          className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-panel pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-2.5 text-[11px] transition-colors ${
              isActive ? "font-medium text-accent" : "text-muted"
            }`
          }
        >
          <Icon size={19} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
