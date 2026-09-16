import { NavLink } from "react-router-dom";
import { Package, Plus, Users, Settings, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const TABS = [
  { to: "/admin-web/", label: "Products", icon: Package, end: true },
  { to: "/admin-web/products/new", label: "New Product", icon: Plus },
  { to: "/admin-web/enquiries", label: "Enquiries", icon: Users },
];

export default function Sidebar({ onOpenSettings }) {
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-57.5 flex-col border-r border-border bg-panel md:flex">
      <div className="border-b border-border px-5 py-5">
        <h1 className="text-[17px] font-semibold leading-none">Catalog Admin</h1>
        <div
          className="mt-1.5 truncate text-[12px] text-muted"
          title={user?.email}
        >
          {user?.email || "Manage your product catalog"}
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {TABS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] transition-colors ${
                isActive
                  ? "bg-accent-soft font-medium text-accent"
                  : "text-ink hover:bg-bg"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-3">
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] text-ink hover:bg-bg"
        >
          <Settings size={16} />
          Settings
        </button>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-[13.5px] text-ink hover:bg-bg"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
