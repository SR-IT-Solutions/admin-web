import { useCallback, useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { getSupabaseClient } from "../lib/supabaseClient";
import * as enquiriesApi from "../api/enquiries";

export function useEnquiries() {
  const { settings, isConfigured } = useSettings();
  const [enquiries, setEnquiries] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const client = isConfigured ? getSupabaseClient(settings) : null;

  const load = useCallback(async () => {
    if (!client) return;
    setStatus("loading");
    setError("");
    try {
      const data = await enquiriesApi.fetchEnquiries(client);
      setEnquiries(data);
      setStatus("ready");
    } catch (err) {
      setError(err.message || "Couldn't load enquiries.");
      setStatus("error");
    }
  }, [client]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (form, editingId) => {
      const payload = enquiriesApi.toEnquiryPayload(form);
      if (editingId) {
        await enquiriesApi.updateEnquiry(client, editingId, payload);
      } else {
        await enquiriesApi.createEnquiry(client, payload);
      }
      await load();
    },
    [client, load],
  );

  const setStatusValue = useCallback(
    async (id, value) => {
      const saved = await enquiriesApi.updateEnquiry(client, id, {
        status: value,
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: saved.status } : e)),
      );
    },
    [client],
  );

  const remove = useCallback(
    async (id) => {
      await enquiriesApi.deleteEnquiry(client, id);
      await load();
    },
    [client, load],
  );

  return {
    enquiries,
    status,
    error,
    reload: load,
    save,
    setStatusValue,
    remove,
  };
}
