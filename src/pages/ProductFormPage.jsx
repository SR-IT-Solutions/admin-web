import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductForm from "../components/products/ProductForm";
import EmptyState from "../components/products/EmptyState";
import { useProduct } from "../hooks/useProduct";

export default function ProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, status, error, save } = useProduct(id);

  const backToList = () => navigate("/admin-web/");

  const handleSave = async (form) => {
    await save(form);
    backToList();
  };

  const renderBody = () => {
    if (status === "loading") {
      return <EmptyState>Loading…</EmptyState>;
    }
    if (status === "error") {
      return <EmptyState>{error}</EmptyState>;
    }
    return (
      <ProductForm
        product={product}
        onSave={handleSave}
        onCancel={backToList}
      />
    );
  };

  return (
    <div>
      <header className="sticky top-14.25 z-30 border-b border-border bg-panel px-4 py-4 md:top-0 md:px-8 md:py-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={backToList}
            title="Back to products"
            className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted hover:bg-bg"
          >
            <ArrowLeft size={17} />
          </button>
          <div>
            <h2 className="text-[19px] font-semibold leading-none">
              {id ? "Edit product" : "New Product"}
            </h2>
            <div className="mt-1 text-[13px] text-muted">
              {id && product?.Title ? product.Title : "New catalog entry"}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-295 px-4 pb-20 pt-5 md:px-8 md:pt-7">
        {renderBody()}
      </main>
    </div>
  );
}
