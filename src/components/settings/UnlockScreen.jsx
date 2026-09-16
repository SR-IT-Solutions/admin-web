import { useState } from "react";
import { KeyRound } from "lucide-react";
import StatusMessage from "../ui/StatusMessage";
import { useSettings } from "../../context/SettingsContext";

export default function UnlockScreen({ onForget }) {
  const { unlock } = useSettings();
  const [passphrase, setPassphrase] = useState("");
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setStatus({ text: "Unlocking…", tone: "muted" });

    const ok = await unlock(passphrase);
    if (!ok) {
      setStatus({ text: "That passphrase doesn't match.", tone: "error" });
      setBusy(false);
      setPassphrase("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-panel p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted">
            <KeyRound size={16} />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold leading-none">
              Catalog Admin
            </h1>
            <p className="mt-1 text-[13px] text-muted">
              Enter your passphrase to unlock
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="vault-passphrase">
            Passphrase
          </label>
          <input
            id="vault-passphrase"
            type="password"
            className="text-input"
            autoComplete="off"
            data-bwignore="true"
            data-1p-ignore="true"
            data-lpignore="true"
            autoFocus
            required
            value={passphrase}
            onChange={(event) => setPassphrase(event.target.value)}
          />

          <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

          <button type="submit" className="btn mt-4 w-full justify-center" disabled={busy}>
            {busy ? "Unlocking…" : "Unlock"}
          </button>
        </form>

        <button
          type="button"
          onClick={onForget}
          className="field-hint mt-4 w-full text-center underline hover:text-ink"
        >
          Forgotten it? Clear and enter the project details again.
        </button>
      </div>
    </div>
  );
}
