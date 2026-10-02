import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";
import { TABS } from "./Sidebar";

const MOBILE_TABS = [
  ...TABS,
  { to: "/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-panel pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {MOBILE_TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `group flex flex-col items-center gap-1 py-2 text-[11px] transition-colors ${
              isActive ? "font-semibold text-accent" : "text-muted"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                  isActive ? "bg-accent-soft" : "group-active:bg-bg"
                }`}
              >
                <Icon size={19} strokeWidth={isActive ? 2.4 : 2} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
