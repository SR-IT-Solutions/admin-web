import Toggle from "../ui/Toggle";

function formatPrice(price) {
  if (price == null || Number.isNaN(Number(price))) return "—";
  return "₹" + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function ProductRow({ product, onView, onEdit, onDelete, onToggleActive }) {
  const image = Array.isArray(product["Image URL"]) ? product["Image URL"][0] : null;
  const isActive = product.is_active !== false;

  const stop = (handler) => (e) => {
    e.stopPropagation();
    handler(product);
  };

  return (
    <tr
      onClick={() => onView(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onView(product);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${product.Title || "product"}`}
      className={`cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-[#fbfaf8] focus:bg-[#fbfaf8] focus:outline-none ${
        isActive ? "" : "opacity-55"
      }`}
    >
      <td className="p-3.5 align-top">
        {image ? (
          <img src={image} alt="" className="h-11 w-11 rounded-md border border-border object-cover" />
        ) : (
          <div className="h-11 w-11 rounded-md border border-border bg-[#eee]" />
        )}
      </td>
      <td className="p-3.5 align-top text-[14px]">{product.Title || ""}</td>
      <td className="p-3.5 align-top text-[14px]">
        {product.Category ? <span className="tag-pill">{product.Category}</span> : null}
      </td>
      <td className="p-3.5 align-top text-[14px]">{formatPrice(product.Price)}</td>
      <td className="p-3.5 align-top text-[14px]">{product.Tag || ""}</td>
      <td className="p-3.5 align-top" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <Toggle
            checked={isActive}
            onChange={() => onToggleActive(product)}
            label={isActive ? "Deactivate product" : "Activate product"}
          />
          <span className={`text-[12.5px] ${isActive ? "" : "text-muted"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </td>
      <td className="w-px whitespace-nowrap p-3.5 align-top">
        <div className="flex gap-2">
          <button className="btn-secondary btn-small" onClick={stop(onEdit)}>
            Edit
          </button>
          <button className="btn-danger btn-small" onClick={stop(onDelete)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
