import { useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { LayoutGrid, Plus, Rows3, Search, X } from "lucide-react";
import ProductTable from "../components/products/ProductTable";
import EmptyState from "../components/products/EmptyState";
import ProductViewModal from "../components/products/ProductViewModal";
import { useProducts } from "../hooks/useProducts";

const VIEW_KEY = "admin.productsView";
const VIEWS = [
  { value: "table", label: "Table view", Icon: Rows3 },
  { value: "grid", label: "Grid view", Icon: LayoutGrid },
];

function readView() {
  try {
    return localStorage.getItem(VIEW_KEY) === "grid" ? "grid" : "table";
  } catch {
    return "table";
  }
}

export default function CatalogPage() {
  const { isConfigured } = useOutletContext();
  const { products, status, error, remove, setActive } = useProducts();
  const navigate = useNavigate();

  const [viewProduct, setViewProduct] = useState(null);
  const [query, setQuery] = useState("");
  const [view, setView] = useState(readView);

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
    }
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [p.Title, p.Category, p.Tag, p.Description, p.Price]
        .filter((v) => v != null && v !== "")
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [products, query]);

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
    if (visible.length === 0) {
      return <EmptyState>No products match &ldquo;{query.trim()}&rdquo;.</EmptyState>;
    }
    return (
      <ProductTable
        products={visible}
        view={view}
        onView={setViewProduct}
        onEdit={(p) => navigate(`/admin-web/products/${p.id}`)}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />
    );
  };

  return (
    <div>
      <header className="sticky top-0 z-30 border-b border-border bg-panel px-4 py-4 md:top-0 md:px-8 md:py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[19px] font-semibold leading-none">Products</h2>
            <div className="mt-1 text-[13px] text-muted">
              {status === "ready" && products.length > 0
                ? query.trim()
                  ? `${visible.length} of ${products.length} product${products.length === 1 ? "" : "s"}`
                  : `${products.length} product${products.length === 1 ? "" : "s"} in the catalog`
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

      <main className="px-4 pb-20 pt-5 md:px-8 md:pt-7">
        {status === "ready" && products.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
          <div className="relative min-w-0 flex-1 sm:max-w-sm">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              className="text-input pl-9 pr-9"
              placeholder="Search title, category, tag, price…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-muted hover:bg-bg"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div
            className="flex shrink-0 items-center gap-0.5 rounded-md border border-border bg-panel p-0.5"
            role="group"
            aria-label="View"
          >
            {VIEWS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => changeView(value)}
                aria-label={label}
                aria-pressed={view === value}
                title={label}
                className={`flex h-8 w-8 items-center justify-center rounded transition-colors ${
                  view === value
                    ? "bg-accent-soft text-accent"
                    : "text-muted hover:bg-bg hover:text-ink"
                }`}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          </div>
        )}
        {renderBody()}
      </main>

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
