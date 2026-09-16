import { Phone, MessageCircle } from "lucide-react";
import {
  ENQUIRY_STATUSES,
  STATUS_CLASS,
  SOURCE_LABEL,
} from "../../constants/enquiries";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const digitsOnly = (phone) => String(phone || "").replace(/\D/g, "");

export default function EnquiryRow({
  enquiry,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const wa = digitsOnly(enquiry.phone);
  const waHref = `https://wa.me/${wa.length === 10 ? "91" + wa : wa}`;

  return (
    <tr
      onClick={() => onEdit(enquiry)}
      className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-[#fbfaf8]"
    >
      <td className="p-3.5 align-top">
        <div className="text-[14px]">{enquiry.name}</div>
        <div className="mt-0.5 text-[12.5px] text-muted">
          {SOURCE_LABEL[enquiry.source] || enquiry.source}
        </div>
      </td>

      <td className="p-3.5 align-top" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] tabular-nums">{enquiry.phone}</span>
          <a
            href={`tel:${enquiry.phone}`}
            title="Call"
            className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted hover:bg-bg"
          >
            <Phone size={13} />
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            title="WhatsApp"
            className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted hover:bg-bg"
          >
            <MessageCircle size={13} />
          </a>
        </div>
      </td>

      <td className="p-3.5 align-top text-[14px]">
        {enquiry.item || <span className="text-muted">—</span>}
      </td>

      <td className="p-3.5 align-top" onClick={(e) => e.stopPropagation()}>
        <select
          value={enquiry.status}
          onChange={(e) => onStatusChange(enquiry, e.target.value)}
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
      </td>

      <td className="max-w-60 p-3.5 align-top text-[13px] text-muted">
        {enquiry.note ? (
          <span className="line-clamp-2">{enquiry.note}</span>
        ) : (
          "—"
        )}
      </td>

      <td className="p-3.5 align-top text-[13px] whitespace-nowrap text-muted">
        {formatDate(enquiry.created_at)}
      </td>

      <td
        className="w-px p-3.5 align-top whitespace-nowrap"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="btn-danger btn-small"
          onClick={() => onDelete(enquiry)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}
