function formatPrice(price) {
  if (price == null || Number.isNaN(Number(price))) return "—";
  return "₹" + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 });
}

export default function ProductRow({ product, onView, onEdit, onDelete }) {
  const image = Array.isArray(product["Image URL"]) ? product["Image URL"][0] : null;

  return (
    <tr className="border-b border-border last:border-b-0">
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
      <td className="w-px whitespace-nowrap p-3.5 align-top">
        <div className="flex gap-2">
          <button className="btn-secondary btn-small" onClick={() => onView(product)}>
            View
          </button>
          <button className="btn-secondary btn-small" onClick={() => onEdit(product)}>
            Edit
          </button>
          <button className="btn-danger btn-small" onClick={() => onDelete(product)}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
