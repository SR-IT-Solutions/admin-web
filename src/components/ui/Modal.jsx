import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children, wide = false }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#14120e]/40 px-3 py-4 sm:px-4 sm:py-10"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className={`w-full rounded-xl border border-border bg-panel p-5 sm:p-7 ${
          wide ? "max-w-2xl" : "max-w-xl"
        }`}
      >
        {title && (
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded border border-border text-muted hover:bg-bg"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
