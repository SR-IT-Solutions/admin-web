import { useState } from "react";
import { Lock } from "lucide-react";
import StatusMessage from "../ui/StatusMessage";
import { useAuth } from "../../context/AuthContext";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus({ text: "Signing in…", tone: "muted" });
    try {
      await signIn(email.trim(), password);
      // On success the session listener swaps this screen out.
    } catch (err) {
      setStatus({
        text: err.message || "Couldn't sign in. Check your email and password.",
        tone: "error",
      });
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-panel p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted">
            <Lock size={16} />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold leading-none">Catalog Admin</h1>
            <p className="mt-1 text-[13px] text-muted">Sign in to manage products</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="field-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="text-input"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="field-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              className="text-input"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

          <button type="submit" className="btn mt-4 w-full justify-center" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="field-hint mt-4">
          Admin accounts are created in Supabase → Authentication → Users.
        </p>
      </div>
    </div>
  );
}
