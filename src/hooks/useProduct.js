import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import * as productsApi from "../api/products";

export function useProduct(id) {
  const { settings, isConfigured } = useSettings();
  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState(id ? "loading" : "ready");
  const [error, setError] = useState("");

  const client = isConfigured ? getSupabaseClient(settings) : null;

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setStatus("ready");
      return;
    }
    if (!client) return;

    let cancelled = false;
    setStatus("loading");
    setError("");

    (async () => {
      try {
        const data = await productsApi.fetchProduct(client, id);
        if (cancelled) return;
        if (!data) {
          setError("That product no longer exists.");
          setStatus("error");
          return;
        }
        setProduct(data);
        setStatus("ready");
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Couldn't load this product.");
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [client, id]);

  const save = useCallback(
    async (form) => {
      const payload = productsApi.toPayload(form);
      if (id) {
        await productsApi.updateProduct(client, id, payload);
      } else {
        await productsApi.createProduct(client, payload);
      }
    },
    [client, id],
  );

  return { product, status, error, save };
}
