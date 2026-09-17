import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import * as productsApi from "../api/products";

export function useImageLibrary(enabled) {
  const { settings, isConfigured } = useSettings();
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const client = isConfigured ? getSupabaseClient(settings) : null;

  const load = useCallback(async () => {
    if (!client) return;
    setStatus("loading");
    setError("");
    try {
      const data = await productsApi.fetchImageLibrary(client);
      setImages(data);
      setStatus("ready");
    } catch (err) {
      setError(err.message || "Couldn't load previous images.");
      setStatus("error");
    }
  }, [client]);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  return { images, status, error, reload: load };
}
