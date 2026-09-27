import { useState } from "react";
import StatusMessage from "../ui/StatusMessage";
import SetupFileImport from "./SetupFileImport";
import PinInput from "../ui/PinInput";
import { EMPTY_SETTINGS, useSettings } from "../../context/SettingsContext";

function Section({ title, hint, children }) {
  return (
    <section className="rounded-xl border border-border bg-panel p-5 sm:p-6">
      <h3 className="text-[15px] font-semibold leading-none">{title}</h3>
      {hint && <p className="mt-1.5 text-[13px] text-muted">{hint}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export default function SettingsForm({ forced = false, onCancel, onSaved }) {
  const { settings, saveSettings, vaultExists } = useSettings();
  const [form, setForm] = useState(() =>
    settings.supabaseUrl ? settings : EMPTY_SETTINGS,
  );
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [saving, setSaving] = useState(false);

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleImport = (values) => {
    setForm((current) => {
      const next = { ...current };
      for (const key of Object.keys(EMPTY_SETTINGS)) {
        if (values[key]) next[key] = values[key];
      }
      return next;
    });
    setStatus({ text: "", tone: "muted" });
  };

  const handleSave = async () => {
    const next = {
      supabaseUrl: (form.supabaseUrl || "").trim(),
      supabaseKey: (form.supabaseKey || "").trim(),
      cloudName: (form.cloudName || "").trim(),
      uploadPreset: (form.uploadPreset || "").trim(),
      adminEmail: (form.adminEmail || "").trim(),
      adminPassword: form.adminPassword || "",
    };

    if (!next.supabaseUrl || !next.supabaseKey) {
      setStatus({ text: "Supabase URL and key are required.", tone: "error" });
      return;
    }
    if (!/^\d{4}$/.test(passphrase)) {
      setStatus({ text: "Your PIN must be exactly 4 digits.", tone: "error" });
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setStatus({ text: "The two PINs don't match.", tone: "error" });
      return;
    }

    setSaving(true);
    setStatus({ text: "Encrypting…", tone: "muted" });
    try {
      await saveSettings(next, passphrase);
      setPassphrase("");
      setConfirmPassphrase("");
      setStatus({ text: "Settings saved.", tone: "ok" });
      onSaved?.();
    } catch {
      setStatus({ text: "Couldn't save these details.", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {forced && <SetupFileImport onImport={handleImport} />}

      <Section
        title="Supabase project"
        hint="Where the catalog and enquiries are stored."
      >
        <div>
          <label className="field-label">Project URL</label>
          <input
            className="text-input"
            placeholder="https://YOUR-PROJECT-REF.supabase.co"
            value={form.supabaseUrl || ""}
            onChange={set("supabaseUrl")}
          />
        </div>
        <div>
          <label className="field-label">Publishable key</label>
          <input
            className="text-input"
            placeholder="sb_publishable_… (Project Settings → API Keys)"
            value={form.supabaseKey || ""}
            onChange={set("supabaseKey")}
          />
        </div>
      </Section>

      <Section
        title="Image uploads"
        hint="Product photos are uploaded straight to Cloudinary."
      >
        <div>
          <label className="field-label">Cloudinary cloud name</label>
          <input
            className="text-input"
            value={form.cloudName || ""}
            onChange={set("cloudName")}
          />
        </div>
        <div>
          <label className="field-label">Unsigned upload preset</label>
          <input
            className="text-input"
            value={form.uploadPreset || ""}
            onChange={set("uploadPreset")}
          />
          <p className="field-hint">
            Cloudinary → Settings → Upload → Upload presets → Signing mode:
            Unsigned.
          </p>
        </div>
      </Section>

      <Section
        title="Sign-in"
        hint="The Supabase account used to sign in to this admin panel."
      >
        <div>
          <label className="field-label">Email</label>
          <input
            type="email"
            className="text-input"
            autoComplete="off"
            placeholder="you@example.com"
            value={form.adminEmail || ""}
            onChange={set("adminEmail")}
          />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input
            type="password"
            className="text-input"
            autoComplete="off"
            data-bwignore="true"
            data-1p-ignore="true"
            data-lpignore="true"
            value={form.adminPassword || ""}
            onChange={set("adminPassword")}
          />
          <p className="field-hint">
            From Supabase → Authentication → Users. Saved so you only sign in
            once; it&rsquo;s encrypted with your PIN like everything else.
          </p>
        </div>
      </Section>

      <Section
        title="PIN"
        hint="Everything above is encrypted with this PIN on this device."
      >
        <div>
          <label className="field-label">
            {vaultExists ? "New 4-digit PIN" : "Choose a 4-digit PIN"}
          </label>
          <PinInput value={passphrase} onChange={setPassphrase} />
          <p className="field-hint">
            You&rsquo;ll enter this each time you open the admin panel. It
            isn&rsquo;t stored anywhere, so it can&rsquo;t be recovered &mdash;
            if you forget it, you&rsquo;ll re-enter the details above.
          </p>
        </div>
        <div>
          <label className="field-label">Confirm PIN</label>
          <PinInput value={confirmPassphrase} onChange={setConfirmPassphrase} />
        </div>
      </Section>

      <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

      <div className="flex justify-end gap-2.5">
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button
          type="button"
          className="btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : forced ? "Save & continue" : "Save settings"}
        </button>
      </div>
    </div>
  );
}
