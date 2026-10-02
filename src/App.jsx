import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/layout/AdminLayout";
import CatalogPage from "./pages/CatalogPage";
import ProductFormPage from "./pages/ProductFormPage";
import EnquiriesPage from "./pages/EnquiriesPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<CatalogPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id" element={<ProductFormPage />} />
        <Route path="enquiries" element={<EnquiriesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
