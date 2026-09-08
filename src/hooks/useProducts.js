import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import * as productsApi from "../api/products";

export function useProducts() {
  const { settings, isConfigured } = useSettings();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | error | ready
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

  const save = useCallback(
    async (form, editingId) => {
      const payload = productsApi.toPayload(form);
      if (editingId) {
        await productsApi.updateProduct(client, editingId, payload);
      } else {
        await productsApi.createProduct(client, payload);
      }
      await load();
    },
    [client, load]
  );

  const remove = useCallback(
    async (id) => {
      await productsApi.deleteProduct(client, id);
      await load();
    },
    [client, load]
  );

  return { products, status, error, reload: load, save, remove };
}
