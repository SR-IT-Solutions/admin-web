import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import EnquiryTable from "../components/enquiries/EnquiryTable";
import EnquiryFormModal from "../components/enquiries/EnquiryFormModal";
import EmptyState from "../components/products/EmptyState";
import { useEnquiries } from "../hooks/useEnquiries";
import {
  ENQUIRY_STATUSES,
  STATUS_LABEL,
  SOURCE_LABEL,
} from "../constants/enquiries";

export default function EnquiriesPage() {
  const { isConfigured } = useOutletContext();
  const { enquiries, status, error, save, setStatusValue, remove } =
    useEnquiries();

  const [formEnquiry, setFormEnquiry] = useState(undefined);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return enquiries;
    const digits = q.replace(/\D/g, "");
    return enquiries.filter((e) => {
      const haystack = [
        e.name,
        e.phone,
        e.item,
        e.note,
        STATUS_LABEL[e.status],
        SOURCE_LABEL[e.source],
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (haystack.includes(q)) return true;
      return (
        digits.length >= 3 &&
        String(e.phone || "")
          .replace(/\D/g, "")
          .includes(digits)
      );
    });
  }, [enquiries, query]);

  const counts = useMemo(() => {
    const map = { all: searched.length };
    ENQUIRY_STATUSES.forEach((s) => {
      map[s.value] = searched.filter((e) => e.status === s.value).length;
    });
    return map;
  }, [searched]);

  const visible = useMemo(
    () =>
      filter === "all" ? searched : searched.filter((e) => e.status === filter),
    [searched, filter],
  );

  const handleDelete = async (enquiry) => {
    if (!confirm(`Delete the enquiry from ${enquiry.name}?`)) return;
    try {
      await remove(enquiry.id);
    } catch (err) {
      alert("Couldn't delete: " + (err.message || "unknown error"));
    }
  };

  const handleStatusChange = async (enquiry, value) => {
    try {
      await setStatusValue(enquiry.id, value);
    } catch (err) {
      alert("Couldn't update status: " + (err.message || "unknown error"));
    }
  };

  const renderBody = () => {
    if (!isConfigured) {
      return (
        <EmptyState>
          Add your Supabase details in Settings to get started.
        </EmptyState>
      );
    }
    if (status === "loading" || status === "idle") {
      return <EmptyState>Loading…</EmptyState>;
    }
    if (status === "error") {
      return <EmptyState>Couldn&rsquo;t load enquiries: {error}</EmptyState>;
    }
    if (enquiries.length === 0) {
      return (
        <EmptyState>
          No enquiries yet. Click &ldquo;New Enquiry&rdquo; to log a walk-in or
          a phone call.
        </EmptyState>
      );
    }
    if (visible.length === 0) {
      return (
        <EmptyState>
          {query.trim()
            ? `No enquiries match “${query.trim()}”.`
            : "No enquiries with this status."}
        </EmptyState>
      );
    }
    return (
      <EnquiryTable
        enquiries={visible}
        onEdit={setFormEnquiry}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    );
  };

  const tabs = [{ value: "all", label: "All" }, ...ENQUIRY_STATUSES];

  return (
    <div>
      <header className="sticky top-14.25 z-30 border-b border-border bg-panel px-4 py-4 md:top-0 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[19px] font-semibold leading-none">
              Enquiries
            </h2>
            <div className="mt-1 text-[13px] text-muted">
              Walk-ins, phone calls and WhatsApp enquiries
            </div>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => setFormEnquiry(null)}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">New Enquiry</span>
          </button>
        </div>
      </header>

      <main className="px-4 pb-20 pt-5 md:px-8 md:pt-7">
        {status === "ready" && enquiries.length > 0 && (
          <div className="relative mb-3 max-w-sm">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              className="text-input pl-9 pr-9"
              placeholder="Search name, phone, item, note…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted hover:bg-bg"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {status === "ready" && enquiries.length > 0 && (
          <div className="mb-4.5 flex flex-wrap gap-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] transition-colors ${
                  filter === tab.value
                    ? "border-accent bg-accent-soft font-medium text-accent"
                    : "border-border text-muted hover:bg-[#fbfaf8]"
                }`}
              >
                {tab.label}
                <span className="ml-1.5 tabular-nums opacity-70">
                  {counts[tab.value] ?? 0}
                </span>
              </button>
            ))}
          </div>
        )}

        {renderBody()}
      </main>

      <EnquiryFormModal
        open={formEnquiry !== undefined}
        enquiry={formEnquiry}
        onClose={() => setFormEnquiry(undefined)}
        onSave={save}
      />
    </div>
  );
}
