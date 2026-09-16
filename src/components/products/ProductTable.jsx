import ProductRow from "./ProductRow";

export default function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  return (
    <table className="w-full overflow-hidden rounded-lg border border-border bg-panel">
      <thead>
        <tr className="bg-[#fbfaf8]">
          <th className="p-3.5 text-left text-[12.5px] font-semibold text-muted"></th>
          <th className="p-3.5 text-left text-[12.5px] font-semibold text-muted">
            Title
          </th>
          <th className="p-3.5 text-left text-[12.5px] font-semibold text-muted">
            Category
          </th>
          <th className="p-3.5 text-left text-[12.5px] font-semibold text-muted">
            Price
          </th>
          <th className="p-3.5 text-left text-[12.5px] font-semibold text-muted">
            Tag
          </th>
          <th className="p-3.5 text-left text-[12.5px] font-semibold text-muted">
            Status
          </th>
          <th className="p-3.5 text-left text-[12.5px] font-semibold text-muted"></th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />
        ))}
      </tbody>
    </table>
  );
}
