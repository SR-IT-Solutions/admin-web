import { Settings } from "lucide-react";

export default function Header({ onOpenSettings }) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-panel px-8 py-5">
      <div>
        <h1 className="text-[19px] font-semibold leading-none">Catalog Admin</h1>
        <div className="mt-1 text-[13px] text-muted">Manage your product catalog</div>
      </div>
      <button
        type="button"
        onClick={onOpenSettings}
        title="Settings"
        className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted hover:bg-bg"
      >
        <Settings size={17} />
      </button>
    </header>
  );
}
