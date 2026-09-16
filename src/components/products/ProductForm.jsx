import { useEffect, useState } from "react";
import StatusMessage from "../ui/StatusMessage";
import CheckboxGroups from "../ui/CheckboxGroups";
import Toggle from "../ui/Toggle";
import ImageUploader from "./ImageUploader";
import {
  CATEGORY_OPTIONS,
  RAM_GROUPS,
  PROCESSOR_GROUPS,
  STORAGE_GROUPS,
  EMPTY_PRODUCT,
  SPEC_FIELDS,
  categoryHasSpecs,
} from "../../constants/options";

function toFormState(product) {
  if (!product) return { ...EMPTY_PRODUCT };
  return {
    Title: product.Title || "",
    Category: product.Category || "",
    Price: product.Price ?? "",
    Tag: product.Tag || "",
    Description: product.Description || "",
    Featured: product.Featured === true,
    is_active: product.is_active !== false,
    "Image URL": Array.isArray(product["Image URL"])
      ? [...product["Image URL"]]
      : [],
    "Supported RAMs": product["Supported RAMs"] || [],
    "Supported Processors": product["Supported Processors"] || [],
    "Supported Storage": product["Supported Storage"] || [],
  };
}

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState(() => toFormState(product));
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(toFormState(product));
  }, [product]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const showSpecs = categoryHasSpecs(form.Category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ text: "Saving…", tone: "muted" });
    try {
      const payload = { ...form };
      if (!showSpecs) {
        SPEC_FIELDS.forEach((field) => {
          payload[field] = [];
        });
      }
      await onSave(payload);
    } catch (err) {
      setStatus({
        text: "Error: " + (err.message || "couldn't save"),
        tone: "error",
      });
      setSaving(false);
    }
  };

  return (
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

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
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
          <label className="flex h-9.5 items-center gap-2 text-[13px]">
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
        <label className="field-label">Status</label>
        <div className="flex h-9.5 items-center gap-2.5">
          <Toggle
            checked={form.is_active}
            onChange={set("is_active")}
            label="Product is active"
          />
          <span className="text-[13px]">
            {form.is_active ? "Active" : "Inactive"}
          </span>
          <span className="text-[12.5px] text-muted">
            {form.is_active
              ? "— visible on the website"
              : "— hidden from the website"}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <label className="field-label">Description</label>
        <textarea
          className="text-input min-h-17.5 resize-y"
          value={form.Description}
          onChange={(e) => set("Description")(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="field-label">Images</label>
        <ImageUploader images={form["Image URL"]} onChange={set("Image URL")} />
      </div>

      {showSpecs && (
        <>
          <div className="mb-4">
            <label className="field-label">Supported RAMs</label>
            <CheckboxGroups
              groups={RAM_GROUPS}
              selected={form["Supported RAMs"]}
              onChange={set("Supported RAMs")}
            />
          </div>

          <div className="mb-4">
            <label className="field-label">Supported Processors</label>
            <CheckboxGroups
              groups={PROCESSOR_GROUPS}
              selected={form["Supported Processors"]}
              onChange={set("Supported Processors")}
            />
          </div>

          <div className="mb-4">
            <label className="field-label">Supported Storage</label>
            <CheckboxGroups
              groups={STORAGE_GROUPS}
              selected={form["Supported Storage"]}
              onChange={set("Supported Storage")}
            />
          </div>
        </>
      )}

      {form.Category && !showSpecs && (
        <div className="mb-4 rounded-md border border-border bg-[#fbfaf8] px-3 py-2.5 text-[12.5px] text-muted">
          {form.Category} products don&rsquo;t use RAM, processor or storage
          options, so those fields are hidden.
        </div>
      )}

      <StatusMessage tone={status.tone}>{status.text}</StatusMessage>

      <div className="mt-5 flex justify-end gap-2.5 border-t border-border pt-4">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </button>
      </div>
    </form>
  );
}
