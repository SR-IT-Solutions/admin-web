import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import StatusMessage from "../ui/StatusMessage";
import { useSettings } from "../../context/SettingsContext";

export default function SettingsModal({ open, onClose, forced }) {
  const { settings, saveSettings } = useSettings();
  const [form, setForm] = useState(settings);
  const [status, setStatus] = useState({ text: "", tone: "muted" });

  useEffect(() => {
    if (open) {
      setForm(settings);
      setStatus({ text: "", tone: "muted" });
    }
  }, [open, settings]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const attemptClose = () => {
    if (!form.supabaseUrl || !form.supabaseKey) {
      setStatus({
        text: "Add at least the Supabase URL and key before closing, or the catalog can't load.",
        tone: "error",
      });
      return;
    }
    onClose();
  };

  const handleSave = () => {
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
    saveSettings(next);
    onClose();
  };

  return (
    <Modal open={open} onClose={forced ? undefined : attemptClose} title="Setup">
      <div className="mb-4 rounded-lg border border-warn-border bg-warn-bg px-3.5 py-3 text-[13px] text-warn-text">
        These keys connect this page to your Supabase project and Cloudinary account. They're
        saved only in this browser's local storage on this laptop — enter them once and this
        screen won't show again.
      </div>

      <div className="mb-4">
        <label className="field-label">Supabase Project URL</label>
        <input
          className="text-input"
          placeholder="https://YOUR-PROJECT-REF.supabase.co"
          value={form.supabaseUrl || ""}
          onChange={set("supabaseUrl")}
        />
      </div>

      <div className="mb-4">
        <label className="field-label">Supabase Anon / Publishable Key</label>
        <input
          className="text-input"
          placeholder="eyJhbGciOi... (from Supabase → Project Settings → API)"
          value={form.supabaseKey || ""}
          onChange={set("supabaseKey")}
        />
      </div>

      <div className="mb-4">
        <label className="field-label">Cloudinary Cloud Name</label>
        <input
          className="text-input"
          placeholder="e.g. my-cloud-name"
          value={form.cloudName || ""}
          onChange={set("cloudName")}
        />
      </div>

      <div className="mb-4">
        <label className="field-label">Cloudinary Unsigned Upload Preset</label>
        <input
          className="text-input"
          placeholder="e.g. catalog_uploads"
          value={form.uploadPreset || ""}
          onChange={set("uploadPreset")}
        />
        <p className="field-hint">
          Create this under Cloudinary → Settings → Upload → Upload presets → Signing Mode:
          Unsigned.
        </p>
      </div>

      <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

      <div className="mt-5 flex justify-end gap-2.5 border-t border-border pt-4">
        <button type="button" className="btn-secondary" onClick={attemptClose}>
          Cancel
        </button>
        <button type="button" className="btn" onClick={handleSave}>
          Save & continue
        </button>
      </div>
    </Modal>
  );
}
