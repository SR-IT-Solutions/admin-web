import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import ProductTable from "../components/products/ProductTable";
import EmptyState from "../components/products/EmptyState";
import ProductViewModal from "../components/products/ProductViewModal";
import { useProducts } from "../hooks/useProducts";

export default function CatalogPage() {
  const { isConfigured } = useOutletContext();
  const { products, status, error, remove, setActive } = useProducts();
  const navigate = useNavigate();

  const [viewProduct, setViewProduct] = useState(null);

  const handleDelete = async (product) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await remove(product.id);
    } catch (err) {
      alert("Couldn't delete: " + (err.message || "unknown error"));
    }
  };

  const handleToggleActive = async (product) => {
    try {
      await setActive(product.id, product.is_active === false);
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
      return <EmptyState>Couldn't load products: {error}</EmptyState>;
    }
    if (products.length === 0) {
      return (
        <EmptyState>
          No products yet. Click &ldquo;New Product&rdquo; to create your first
          one.
        </EmptyState>
      );
    }
    return (
      <ProductTable
        products={products}
        onView={setViewProduct}
        onEdit={(p) => navigate(`/admin-web/products/${p.id}`)}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />
    );
  };

  return (
    <div>
      <header className="sticky top-[57px] z-30 border-b border-border bg-panel px-4 py-4 md:top-0 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[19px] font-semibold leading-none">Products</h2>
            <div className="mt-1 text-[13px] text-muted">
              {status === "ready" && products.length > 0
                ? `${products.length} product${products.length === 1 ? "" : "s"} in the catalog`
                : "Manage your product catalog"}
            </div>
          </div>
          <button
            type="button"
            className="btn"
            onClick={() => navigate("/admin-web/products/new")}
          >
            <Plus size={15} />
            <span className="hidden sm:inline">New Product</span>
          </button>
        </div>
      </header>

      <main className="px-4 pb-20 pt-5 md:px-8 md:pt-7">{renderBody()}</main>

      <ProductViewModal
        open={Boolean(viewProduct)}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={() => {
          const p = viewProduct;
          setViewProduct(null);
          navigate(`/admin-web/products/${p.id}`);
        }}
      />
    </div>
  );
}
