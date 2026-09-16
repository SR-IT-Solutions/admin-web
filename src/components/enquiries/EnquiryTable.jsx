import EnquiryRow from "./EnquiryRow";

const HEADINGS = ["Customer", "Phone", "Item", "Status", "Note", "Date", ""];

export default function EnquiryTable({
  enquiries,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
    <table className="w-full min-w-200 overflow-hidden rounded-lg border border-border bg-panel">
      <thead>
        <tr className="bg-[#fbfaf8]">
          {HEADINGS.map((heading, i) => (
            <th
              key={heading || i}
              className="p-3.5 text-left text-[12.5px] font-semibold text-muted"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {enquiries.map((enquiry) => (
          <EnquiryRow
            key={enquiry.id}
            enquiry={enquiry}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </tbody>
    </table>
    </div>
  );
}
