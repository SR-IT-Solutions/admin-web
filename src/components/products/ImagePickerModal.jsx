import { Check } from "lucide-react";
import Modal from "../ui/Modal";
import StatusMessage from "../ui/StatusMessage";
import { useImageLibrary } from "../../hooks/useImageLibrary";

export default function ImagePickerModal({ open, selected, onPick, onClose }) {
  const { images, status, error } = useImageLibrary(open);

  return (
    <Modal open={open} onClose={onClose} title="Previously uploaded images" wide>
      {status === "loading" && (
        <StatusMessage tone="muted">Loading images…</StatusMessage>
      )}
      {status === "error" && <StatusMessage tone="error">{error}</StatusMessage>}
      {status === "ready" && images.length === 0 && (
        <StatusMessage tone="muted">
          No images yet. Upload one and it&rsquo;ll appear here next time.
        </StatusMessage>
      )}

      {images.length > 0 && (
        <>
          <p className="field-hint mb-3 mt-0">
            Newest first. Tap an image to add it to this product.
          </p>
          <div className="grid max-h-[55vh] grid-cols-3 gap-2.5 overflow-y-auto sm:grid-cols-4">
            {images.map(({ url, usedBy }) => {
              const isSelected = selected.includes(url);
              return (
                <button
                  key={url}
                  type="button"
                  onClick={() => !isSelected && onPick(url)}
                  disabled={isSelected}
                  title={usedBy}
                  aria-pressed={isSelected}
                  className={`relative aspect-square overflow-hidden rounded-md border transition ${
                    isSelected
                      ? "cursor-default border-accent opacity-55"
                      : "border-border hover:border-accent"
                  }`}
                >
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
                      <Check size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </Modal>
  );
}
