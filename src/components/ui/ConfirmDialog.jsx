import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-[14px] text-ink">{message}</p>

      <div className="mt-5 flex justify-end gap-2.5 border-t border-border pt-4">
        <button type="button" className="btn-secondary" onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={danger ? "btn-danger" : "btn"}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
