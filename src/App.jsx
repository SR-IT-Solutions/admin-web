import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import CatalogPage from "./pages/CatalogPage";
import ProductFormPage from "./pages/ProductFormPage";

export default function App() {
  return (
    <Routes>
      <Route path="/admin-web" element={<AdminLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id" element={<ProductFormPage />} />
      </Route>
    </Routes>
  );
}
