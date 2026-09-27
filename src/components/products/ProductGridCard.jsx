import { Pencil, Trash2 } from "lucide-react";
import Toggle from "../ui/Toggle";
import { formatPrice } from "./formatPrice";
import { thumbUrl } from "../../lib/imageUrl";

export default function ProductGridCard({
  product,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}) {
  const image = Array.isArray(product["Image URL"])
    ? product["Image URL"][0]
    : null;
  const isActive = product.is_active !== false;

  const stop = (handler) => (e) => {
    e.stopPropagation();
    handler(product);
  };

  return (
    <div
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
      className={`flex flex-col overflow-hidden rounded-lg border border-border bg-panel transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 ${
        isActive ? "" : "opacity-55"
      }`}
    >
      <div className="aspect-square w-full overflow-hidden border-b border-border bg-[#eee]">
        {image && (
          <img
            src={thumbUrl(image, 360)}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <div
          className="line-clamp-2 text-[12.5px] font-medium leading-snug"
          title={product.Title}
        >
          {product.Title || ""}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium">{formatPrice(product.Price)}</span>
          {product.Category ? (
            <span className="tag-pill max-w-[55%] truncate text-[10.5px]!">
              {product.Category}
            </span>
          ) : null}
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-border pt-2">
          <div
            className="flex items-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <Toggle
              checked={isActive}
              onChange={() => onToggleActive(product)}
              label={isActive ? "Deactivate product" : "Activate product"}
            />
            <span className={`hidden text-[11.5px] sm:inline ${isActive ? "" : "text-muted"}`}>
              {isActive ? "Active" : "Off"}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={stop(onEdit)}
              aria-label="Edit product"
              title="Edit"
              className="flex h-7 w-7 items-center justify-center rounded border border-border text-muted hover:bg-bg hover:text-ink"
            >
              <Pencil size={13} />
            </button>
            <button
              type="button"
              onClick={stop(onDelete)}
              aria-label="Delete product"
              title="Delete"
              className="flex h-7 w-7 items-center justify-center rounded border border-border text-danger hover:bg-danger hover:text-white"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
