import { Phone, MessageCircle } from "lucide-react";
import {
  ENQUIRY_STATUSES,
  STATUS_CLASS,
  SOURCE_LABEL,
} from "../../constants/enquiries";
import { formatDate, digitsOnly } from "./enquiryFormat";

export default function EnquiryCard({
  enquiry,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const wa = digitsOnly(enquiry.phone);
  const waHref = `https://wa.me/${wa.length === 10 ? "91" + wa : wa}`;

  return (
    <div
      onClick={() => onEdit(enquiry)}
      className="rounded-lg border border-border bg-panel p-3.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[14px] font-medium">{enquiry.name}</div>
          <div className="mt-0.5 text-[12.5px] text-muted">
            {SOURCE_LABEL[enquiry.source] || enquiry.source}
          </div>
        </div>
        <span className="flex-none text-[12.5px] text-muted">
          {formatDate(enquiry.created_at)}
        </span>
      </div>

      <div
        className="mt-2.5 flex items-center gap-1.5"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[14px] tabular-nums">{enquiry.phone}</span>
        <a
          href={`tel:${enquiry.phone}`}
          title="Call"
          className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted"
        >
          <Phone size={13} />
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          title="WhatsApp"
          className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted"
        >
          <MessageCircle size={13} />
        </a>
      </div>

      {enquiry.item ? (
        <div className="mt-2 text-[14px]">{enquiry.item}</div>
      ) : null}

      {enquiry.note ? (
        <div className="mt-1.5 line-clamp-2 text-[13px] text-muted">
          {enquiry.note}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
        <select
          value={enquiry.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(enquiry, e.target.value);
          }}
          className={`rounded-full border px-2.5 py-1 text-[12px] font-medium ${
            STATUS_CLASS[enquiry.status] || ""
          }`}
        >
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          className="btn-danger btn-small"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(enquiry);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
