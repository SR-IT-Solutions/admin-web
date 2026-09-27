import ProductRow from "./ProductRow";
import ProductCard from "./ProductCard";
import ProductGridCard from "./ProductGridCard";

export default function ProductTable({
  products,
  view = "table",
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {products.map((p) => (
          <ProductGridCard
            key={p.id}
            product={p}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleActive={onToggleActive}
          />
        ))}
      </div>
    );
  }

  return (
    <>
    <div className="space-y-2.5 md:hidden">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleActive={onToggleActive}
        />
      ))}
    </div>

    <div className="hidden overflow-x-auto md:block">
    <table className="w-full min-w-180 overflow-hidden rounded-lg border border-border bg-panel">
      <thead>
        <tr className="bg-[#fbfaf8]">
          <th className="w-[4.75rem] p-3.5 text-left text-[12.5px] font-semibold text-muted"></th>
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
    </div>
    </>
  );
}
