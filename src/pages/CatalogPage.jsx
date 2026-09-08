import { useState } from "react";
import { Plus } from "lucide-react";
import Header from "../components/layout/Header";
import ProductTable from "../components/products/ProductTable";
import EmptyState from "../components/products/EmptyState";
import ProductFormModal from "../components/products/ProductFormModal";
import ProductViewModal from "../components/products/ProductViewModal";
import SettingsModal from "../components/settings/SettingsModal";
import { useSettings } from "../context/SettingsContext";
import { useProducts } from "../hooks/useProducts";

export default function CatalogPage() {
  const { isConfigured } = useSettings();
  const { products, status, error, save, remove } = useProducts();

  const [settingsOpen, setSettingsOpen] = useState(!isConfigured);
  const [formProduct, setFormProduct] = useState(undefined); // undefined = closed, null = add, object = edit
  const [viewProduct, setViewProduct] = useState(null);

  const handleDelete = async (product) => {
    if (!confirm("Delete this product? This can't be undone.")) return;
    try {
      await remove(product.id);
    } catch (err) {
      alert("Couldn't delete: " + (err.message || "unknown error"));
    }
  };

  const renderBody = () => {
    if (!isConfigured) {
      return <EmptyState>Add your Supabase details in Settings to get started.</EmptyState>;
    }
    if (status === "loading" || status === "idle") {
      return <EmptyState>Loading…</EmptyState>;
    }
    if (status === "error") {
      return <EmptyState>Couldn't load products: {error}</EmptyState>;
    }
    if (products.length === 0) {
      return <EmptyState>No products yet. Click &ldquo;Add product&rdquo; to create your first one.</EmptyState>;
    }
    return (
      <ProductTable
        products={products}
        onView={setViewProduct}
        onEdit={(p) => setFormProduct(p)}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <div>
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      <main className="mx-auto max-w-[1080px] px-8 pb-20 pt-7">
        <div className="mb-[18px] flex items-center justify-between">
          <div className="text-[13px] text-muted">
            {status === "ready" && products.length > 0
              ? `${products.length} product${products.length === 1 ? "" : "s"}`
              : ""}
          </div>
          <button type="button" className="btn" onClick={() => setFormProduct(null)}>
            <Plus size={15} /> Add product
          </button>
        </div>

        {renderBody()}
      </main>

      <SettingsModal
        open={settingsOpen}
        forced={!isConfigured}
        onClose={() => setSettingsOpen(false)}
      />

      <ProductFormModal
        open={formProduct !== undefined}
        product={formProduct}
        onClose={() => setFormProduct(undefined)}
        onSave={save}
      />

      <ProductViewModal
        open={Boolean(viewProduct)}
        product={viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={() => {
          const p = viewProduct;
          setViewProduct(null);
          setFormProduct(p);
        }}
      />
    </div>
  );
}
