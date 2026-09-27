import Toggle from "../ui/Toggle";
import { formatPrice } from "./formatPrice";
import { thumbUrl } from "../../lib/imageUrl";

export default function ProductCard({
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
      className={`rounded-lg border border-border bg-panel p-3.5 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/30 ${
        isActive ? "" : "opacity-55"
      }`}
    >
      <div className="flex gap-3">
        <div className="h-14 w-14 flex-none overflow-hidden rounded-md border border-border bg-[#eee]">
          {image && (
            <img
              src={thumbUrl(image, 112)}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-[14px] font-medium leading-snug">
            {product.Title || ""}
          </div>
          <div className="mt-1 text-[14px]">{formatPrice(product.Price)}</div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {product.Category ? (
              <span className="tag-pill">{product.Category}</span>
            ) : null}
            {product.Tag ? (
              <span className="text-[12px] text-muted">{product.Tag}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Toggle
            checked={isActive}
            onChange={() => onToggleActive(product)}
            label={isActive ? "Deactivate product" : "Activate product"}
          />
          <span className={`text-[12.5px] ${isActive ? "" : "text-muted"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="flex gap-2">
          <button className="btn-secondary btn-small" onClick={stop(onEdit)}>
            Edit
          </button>
          <button className="btn-danger btn-small" onClick={stop(onDelete)}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
