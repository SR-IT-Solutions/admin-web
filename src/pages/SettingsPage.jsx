import { useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import SettingsForm from "../components/settings/SettingsForm";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { SIGN_OUT_MESSAGE } from "../components/layout/signOutMessage";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-border bg-panel px-4 py-4 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[19px] font-semibold leading-none">Settings</h2>
            <div className="mt-1 text-[13px] text-muted">
              Project connection, uploads and sign-in
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setConfirmOpen(true)}
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl space-y-4 px-4 pb-20 pt-5 md:px-8 md:pt-7">
        <section className="flex items-center gap-3 rounded-xl border border-border bg-panel p-5 sm:p-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border text-muted">
            <UserRound size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] text-muted">Signed in as</div>
            <div className="truncate text-[15px] font-medium" title={user?.email}>
              {user?.email || "Not signed in"}
            </div>
          </div>
        </section>

        <SettingsForm />
      </main>

      <ConfirmDialog
        open={confirmOpen}
        title="Sign out?"
        message={SIGN_OUT_MESSAGE}
        confirmLabel="Sign out"
        danger
        onConfirm={signOut}
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
