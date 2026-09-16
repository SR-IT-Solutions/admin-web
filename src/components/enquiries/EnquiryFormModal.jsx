import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import StatusMessage from "../ui/StatusMessage";
import {
  ENQUIRY_STATUSES,
  ENQUIRY_SOURCES,
  EMPTY_ENQUIRY,
} from "../../constants/enquiries";

function toFormState(enquiry) {
  if (!enquiry) return { ...EMPTY_ENQUIRY };
  return {
    name: enquiry.name || "",
    phone: enquiry.phone || "",
    item: enquiry.item || "",
    status: enquiry.status || "new",
    source: enquiry.source || "walk-in",
    note: enquiry.note || "",
  };
}

export default function EnquiryFormModal({ open, enquiry, onClose, onSave }) {
  const [form, setForm] = useState(() => toFormState(enquiry));
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(toFormState(enquiry));
      setStatus({ text: "", tone: "muted" });
      setSaving(false);
    }
  }, [open, enquiry]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ text: "Saving…", tone: "muted" });
    try {
      await onSave(form, enquiry?.id ?? null);
      onClose();
    } catch (err) {
      setStatus({
        text: "Error: " + (err.message || "couldn't save"),
        tone: "error",
      });
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={enquiry ? "Edit enquiry" : "New enquiry"}
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className="field-label">Customer name</label>
            <input
              className="text-input"
              required
              autoFocus
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Phone</label>
            <input
              className="text-input"
              type="tel"
              required
              placeholder="9620777844"
              value={form.phone}
              onChange={(e) => set("phone")(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="field-label">Item / product asked about</label>
          <input
            className="text-input"
            placeholder="e.g. i5 laptop under 25k, CCTV for shop"
            value={form.item}
            onChange={(e) => set("item")(e.target.value)}
          />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label className="field-label">Status</label>
            <select
              className="text-input"
              value={form.status}
              onChange={(e) => set("status")(e.target.value)}
            >
              {ENQUIRY_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Source</label>
            <select
              className="text-input"
              value={form.source}
              onChange={(e) => set("source")(e.target.value)}
            >
              {ENQUIRY_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="field-label">Note</label>
          <textarea
            className="text-input min-h-20 resize-y"
            placeholder="Budget, what they need it for, when they'll come back…"
            value={form.note}
            onChange={(e) => set("note")(e.target.value)}
          />
        </div>

        <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-border pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={saving}>
            {saving ? "Saving…" : "Save enquiry"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
