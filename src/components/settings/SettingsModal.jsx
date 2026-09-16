import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import StatusMessage from "../ui/StatusMessage";
import { useSettings } from "../../context/SettingsContext";

const BLANK = {
  supabaseUrl: "",
  supabaseKey: "",
  cloudName: "",
  uploadPreset: "",
};

export default function SettingsModal({ open, onClose, forced }) {
  const { settings, saveSettings, vaultExists } = useSettings();
  const [form, setForm] = useState(settings);
  const [passphrase, setPassphrase] = useState("");
  const [confirmPassphrase, setConfirmPassphrase] = useState("");
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(settings.supabaseUrl ? settings : BLANK);
      setPassphrase("");
      setConfirmPassphrase("");
      setStatus({ text: "", tone: "muted" });
    }
  }, [open, settings]);

  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const handleSave = async () => {
    const next = {
      supabaseUrl: form.supabaseUrl.trim(),
      supabaseKey: form.supabaseKey.trim(),
      cloudName: (form.cloudName || "").trim(),
      uploadPreset: (form.uploadPreset || "").trim(),
    };

    if (!next.supabaseUrl || !next.supabaseKey) {
      setStatus({ text: "Supabase URL and key are required.", tone: "error" });
      return;
    }
    if (passphrase.length < 8) {
      setStatus({
        text: "Use a passphrase of at least 8 characters.",
        tone: "error",
      });
      return;
    }
    if (passphrase !== confirmPassphrase) {
      setStatus({ text: "The two passphrases don't match.", tone: "error" });
      return;
    }

    setSaving(true);
    setStatus({ text: "Encrypting…", tone: "muted" });
    try {
      await saveSettings(next, passphrase);
      onClose();
    } catch {
      setStatus({ text: "Couldn't save these details.", tone: "error" });
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={forced ? undefined : onClose} title="Project setup">
      <div className="mb-4 rounded-lg border border-warn-border bg-warn-bg px-3.5 py-3 text-[13px] text-warn-text">
        These details connect this page to your Supabase project and Cloudinary
        account. They&rsquo;re encrypted with your passphrase and kept in this
        browser only &mdash; never uploaded, and not readable without it.
      </div>

      <div className="mb-4">
        <label className="field-label">Supabase project URL</label>
        <input
          className="text-input"
          placeholder="https://YOUR-PROJECT-REF.supabase.co"
          value={form.supabaseUrl || ""}
          onChange={set("supabaseUrl")}
        />
      </div>

      <div className="mb-4">
        <label className="field-label">Supabase publishable key</label>
        <input
          className="text-input"
          placeholder="sb_publishable_… (Project Settings → API Keys)"
          value={form.supabaseKey || ""}
          onChange={set("supabaseKey")}
        />
      </div>

      <div className="mb-4">
        <label className="field-label">Cloudinary cloud name</label>
        <input
          className="text-input"
          value={form.cloudName || ""}
          onChange={set("cloudName")}
        />
      </div>

      <div className="mb-5">
        <label className="field-label">Cloudinary unsigned upload preset</label>
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

      <div className="mb-4 border-t border-border pt-4">
        <label className="field-label">
          {vaultExists ? "New passphrase" : "Choose a passphrase"}
        </label>
        <input
          type="password"
          className="text-input"
          autoComplete="off"
          data-bwignore="true"
          data-1p-ignore="true"
          data-lpignore="true"
          value={passphrase}
          onChange={(event) => setPassphrase(event.target.value)}
        />
        <p className="field-hint">
          You&rsquo;ll enter this each time you open the admin panel. It
          isn&rsquo;t stored anywhere, so it can&rsquo;t be recovered &mdash;
          if you forget it, you&rsquo;ll re-enter the details above.
        </p>
      </div>

      <div className="mb-4">
        <label className="field-label">Confirm passphrase</label>
        <input
          type="password"
          className="text-input"
          autoComplete="off"
          data-bwignore="true"
          data-1p-ignore="true"
          data-lpignore="true"
          value={confirmPassphrase}
          onChange={(event) => setConfirmPassphrase(event.target.value)}
        />
      </div>

      <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

      <div className="mt-5 flex justify-end gap-2.5 border-t border-border pt-4">
        {!forced && (
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        )}
        <button type="button" className="btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save & continue"}
        </button>
      </div>
    </Modal>
  );
}
