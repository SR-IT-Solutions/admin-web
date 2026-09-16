import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import * as productsApi from "../api/products";

export function useProducts() {
  const { settings, isConfigured } = useSettings();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const client = isConfigured ? getSupabaseClient(settings) : null;

  const load = useCallback(async () => {
    if (!client) return;
    setStatus("loading");
    setError("");
    try {
      const data = await productsApi.fetchProducts(client);
      setProducts(data);
      setStatus("ready");
    } catch (err) {
      setError(err.message || "Couldn't load products.");
      setStatus("error");
    }
  }, [client]);

  useEffect(() => {
    load();
  }, [load]);

  const setActive = useCallback(
    async (id, isActive) => {
      const saved = await productsApi.setProductActive(client, id, isActive);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: saved.is_active } : p))
      );
    },
    [client]
  );

  const remove = useCallback(
    async (id) => {
      await productsApi.deleteProduct(client, id);
      await load();
    },
    [client, load]
  );

  return { products, status, error, reload: load, remove, setActive };
}
