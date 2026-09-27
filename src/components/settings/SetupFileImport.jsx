import { useRef, useState } from "react";
import { FileJson, Upload } from "lucide-react";
import StatusMessage from "../ui/StatusMessage";
import {
  FIELD_LABELS,
  SETUP_FILE_EXAMPLE,
  parseSetupFile,
} from "../../lib/setupFile";

const listFields = (fields) => fields.map((f) => FIELD_LABELS[f]).join(", ");

export default function SetupFileImport({ onImport }) {
  const inputRef = useRef(null);
  const [status, setStatus] = useState({ text: "", tone: "muted" });
  const [dragging, setDragging] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pasted, setPasted] = useState("");

  const apply = (text, sourceName) => {
    const result = parseSetupFile(text);
    if (!result.ok) {
      setStatus({ text: result.error, tone: "error" });
      return;
    }

    onImport(result.values);

    setStatus({
      text: result.missing.length
        ? `Still needs: ${listFields(result.missing)}.`
        : "Loaded.",
      tone: result.missing.length ? "muted" : "ok",
    });
  };

  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onerror = () =>
      setStatus({ text: "Couldn't read that file.", tone: "error" });
    reader.onload = () => apply(String(reader.result || ""), file.name);
    reader.readAsText(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    readFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div className="mb-5 rounded-lg border border-border bg-bg p-3.5">
      <div className="mb-2.5 flex items-center gap-2">
        <FileJson size={15} className="text-muted" />
        <span className="text-[13px] font-medium">Start from a setup file</span>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-5 text-center transition-colors ${
          dragging ? "border-accent bg-accent-soft" : "border-border bg-panel"
        }`}
      >
        <Upload size={18} className="mb-2 text-muted" />
        <span className="text-[13px]">
          Drop your <code>.json</code> file here, or click to choose one
        </span>
        <span className="field-hint mt-1">
          Fills every field below in one go.
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(event) => {
          readFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <button
          type="button"
          className="text-[12.5px] text-muted underline underline-offset-2 hover:text-ink"
          onClick={() => setShowPaste((open) => !open)}
        >
          {showPaste ? "Hide paste box" : "Or paste the JSON instead"}
        </button>
      </div>

      {showPaste && (
        <div className="mt-2.5">
          <textarea
            className="text-input min-h-28 font-mono text-[12px]"
            placeholder={SETUP_FILE_EXAMPLE}
            value={pasted}
            onChange={(event) => setPasted(event.target.value)}
          />
          <button
            type="button"
            className="btn-secondary mt-2"
            onClick={() => apply(pasted, "")}
            disabled={!pasted.trim()}
          >
            Use pasted JSON
          </button>
        </div>
      )}

      <StatusMessage tone={status.tone}>{status.text}</StatusMessage>
    </div>
  );
}
