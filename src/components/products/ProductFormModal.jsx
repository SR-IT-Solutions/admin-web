import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import StatusMessage from "../ui/StatusMessage";
import CheckboxGrid from "../ui/CheckboxGrid";
import ImageUploader from "./ImageUploader";
import {
  CATEGORY_OPTIONS,
  RAM_OPTIONS,
  PROCESSOR_OPTIONS,
  STORAGE_OPTIONS,
  EMPTY_PRODUCT,
} from "../../constants/options";

function toFormState(product) {
  if (!product) return { ...EMPTY_PRODUCT };
  return {
    Title: product.Title || "",
    Category: product.Category || "",
    Price: product.Price ?? "",
    Tag: product.Tag || "",
    Description: product.Description || "",
    Featured: product.Featured === "true" || product.Featured === true,
    "Image URL": Array.isArray(product["Image URL"]) ? [...product["Image URL"]] : [],
    "Supported RAMs": product["Supported RAMs"] || [],
    "Supported Processors": product["Supported Processors"] || [],
    "Supported Storage": product["Supported Storage"] || [],
  };
}

export default function ProductFormModal({ open, product, onClose, onSave }) {
  const [form, setForm] = useState(() => toFormState(product));
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(toFormState(product));
      setStatus({ text: "", tone: "muted" });
    }
  }, [open, product]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ text: "Saving…", tone: "muted" });
    try {
      await onSave(form, product?.id ?? null);
      setStatus({ text: "Saved.", tone: "ok" });
      setTimeout(onClose, 350);
    } catch (err) {
      setStatus({ text: "Error: " + (err.message || "couldn't save"), tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={product ? "Edit product" : "Add product"} wide>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="field-label">Title</label>
          <input
            className="text-input"
            required
            value={form.Title}
            onChange={(e) => set("Title")(e.target.value)}
          />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3.5">
          <div>
            <label className="field-label">Category</label>
            <select
              className="text-input"
              required
              value={form.Category}
              onChange={(e) => set("Category")(e.target.value)}
            >
              <option value="">Select…</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Price (₹)</label>
            <input
              type="number"
              step="0.01"
              className="text-input"
              required
              value={form.Price}
              onChange={(e) => set("Price")(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3.5">
          <div>
            <label className="field-label">Tag</label>
            <input
              className="text-input"
              placeholder="e.g. Popular, New, Best Seller"
              value={form.Tag}
              onChange={(e) => set("Tag")(e.target.value)}
            />
          </div>
          <div>
            <label className="field-label">Featured</label>
            <label className="flex h-[38px] items-center gap-2 text-[13px]">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-accent"
                checked={form.Featured}
                onChange={(e) => set("Featured")(e.target.checked)}
              />
              Show as featured product
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="field-label">Description</label>
          <textarea
            className="text-input min-h-[70px] resize-y"
            value={form.Description}
            onChange={(e) => set("Description")(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="field-label">Images</label>
          <ImageUploader images={form["Image URL"]} onChange={set("Image URL")} />
        </div>

        <div className="mb-4">
          <label className="field-label">Supported RAMs</label>
          <CheckboxGrid
            options={RAM_OPTIONS}
            selected={form["Supported RAMs"]}
            onChange={set("Supported RAMs")}
          />
        </div>

        <div className="mb-4">
          <label className="field-label">Supported Processors</label>
          <CheckboxGrid
            options={PROCESSOR_OPTIONS}
            selected={form["Supported Processors"]}
            onChange={set("Supported Processors")}
          />
        </div>

        <div className="mb-4">
          <label className="field-label">Supported Storage</label>
          <CheckboxGrid
            options={STORAGE_OPTIONS}
            selected={form["Supported Storage"]}
            onChange={set("Supported Storage")}
          />
        </div>

        <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

        <div className="mt-5 flex justify-end gap-2.5 border-t border-border pt-4">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn" disabled={saving}>
            Save product
          </button>
        </div>
      </form>
    </Modal>
  );
}
