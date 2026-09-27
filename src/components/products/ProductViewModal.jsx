import { useState } from "react";
import Modal from "../ui/Modal";
import ImageLightbox from "../ui/ImageLightbox";
import { thumbUrl } from "../../lib/imageUrl";
import { categoryHasSpecs } from "../../constants/options";

function ChipList({ values }) {
  if (!values || values.length === 0) {
    return <span className="text-[13px] text-muted">None specified</span>;
  }
  return (
    <>
      {values.map((v) => (
        <span key={v} className="tag-pill mr-1 mb-1 inline-block">
          {v}
        </span>
      ))}
    </>
  );
}

export default function ProductViewModal({ open, product, onClose, onEdit }) {
  const [previewIndex, setPreviewIndex] = useState(null);

  if (!product) return null;

  const images = Array.isArray(product["Image URL"])
    ? product["Image URL"]
    : [];
  const isFeatured = product.Featured === true;
  const price =
    product.Price != null
      ? "₹" +
        Number(product.Price).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
        })
      : "—";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={product.Title || "Untitled product"}
    >
      <div className="mb-3 flex flex-wrap gap-2">
        {images.length ? (
          images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setPreviewIndex(i)}
              aria-label={`Preview image ${i + 1}`}
              className="h-22 w-22 overflow-hidden rounded-md border border-border transition hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
            >
              <img
                src={thumbUrl(url, 176)}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </button>
          ))
        ) : (
          <span className="text-[13px] text-muted">No images</span>
        )}
      </div>

      <div className="mb-4">
        <label className="field-label">Category</label>
        <div>
          {product.Category ? (
            <span className="tag-pill">{product.Category}</span>
          ) : (
            "—"
          )}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="field-label">Price</label>
          <div className="text-[14px]">{price}</div>
        </div>
        <div>
          <label className="field-label">Tag</label>
          <div className="text-[14px]">{product.Tag || "—"}</div>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label className="field-label">Featured</label>
          <div className="text-[14px]">{isFeatured ? "Yes" : "No"}</div>
        </div>
        <div>
          <label className="field-label">Status</label>
          <div className="text-[14px]">
            {product.is_active === false ? "Inactive" : "Active"}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="field-label">Description</label>
        <div className="text-[14px] leading-relaxed text-muted">
          {product.Description || "No description added."}
        </div>
      </div>

      {categoryHasSpecs(product.Category) && (
        <>
          <div className="mb-4">
            <label className="field-label">Supported RAMs</label>
            <ChipList values={product["Supported RAMs"]} />
          </div>

          <div className="mb-4">
            <label className="field-label">Supported Processors</label>
            <ChipList values={product["Supported Processors"]} />
          </div>

          <div className="mb-4">
            <label className="field-label">Supported Storage</label>
            <ChipList values={product["Supported Storage"]} />
          </div>
        </>
      )}

      <div className="mt-5 flex justify-end gap-2.5 border-t border-border pt-4">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Close
        </button>
        <button type="button" className="btn" onClick={onEdit}>
          Edit product
        </button>
      </div>
      <ImageLightbox
        images={images}
        index={previewIndex}
        onClose={() => setPreviewIndex(null)}
        onIndexChange={setPreviewIndex}
      />
    </Modal>
  );
}
