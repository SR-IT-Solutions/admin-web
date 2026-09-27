import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { largeUrl } from "../../lib/imageUrl";
import { useScrollLock } from "../../hooks/useScrollLock";

const RING = 2 * Math.PI * 20;

function ProgressRing({ percent }) {
  const determinate = percent != null;
  const offset = determinate ? RING * (1 - percent / 100) : RING * 0.75;
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <svg
        viewBox="0 0 48 48"
        className={`h-14 w-14 -rotate-90 ${determinate ? "" : "animate-spin"}`}
      >
        <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={RING}
          strokeDashoffset={offset}
          style={{ transition: determinate ? "stroke-dashoffset 120ms linear" : "none" }}
        />
      </svg>
      {determinate && (
        <span className="absolute text-[11px] font-semibold tabular-nums text-white">
          {percent}%
        </span>
      )}
    </div>
  );
}

async function fetchWithProgress(url, signal, onProgress) {
  const response = await fetch(url, { signal, mode: "cors" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const total = Number(response.headers.get("content-length")) || 0;
  if (!response.body || !total) {
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
  const reader = response.body.getReader();
  const chunks = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(Math.min(99, Math.round((received / total) * 100)));
  }
  const blob = new Blob(chunks, { type: response.headers.get("content-type") || "image/jpeg" });
  return URL.createObjectURL(blob);
}

export default function ImageLightbox({ images, index, onClose, onIndexChange }) {
  const count = images?.length ?? 0;
  const open = index != null && index >= 0 && index < count;
  const src = open ? largeUrl(images[index]) : null;

  const cache = useRef(new Map());
  const [ready, setReady] = useState(null);
  const [percent, setPercent] = useState(null);
  const [fallback, setFallback] = useState(false);

  useScrollLock(open);

  useEffect(() => {
    if (!src) return;
    const cached = cache.current.get(src);
    if (cached) {
      setReady({ src, url: cached });
      setPercent(null);
      setFallback(false);
      return;
    }

    setReady(null);
    setPercent(0);
    setFallback(false);
    const controller = new AbortController();

    fetchWithProgress(src, controller.signal, setPercent)
      .then((url) => {
        cache.current.set(src, url);
        setReady({ src, url });
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setPercent(null);
        setFallback(true);
      });

    return () => controller.abort();
  }, [src]);

  useEffect(() => {
    const store = cache.current;
    return () => {
      store.forEach((url) => URL.revokeObjectURL(url));
      store.clear();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (count > 1 && e.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (count > 1 && e.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, count, onClose, onIndexChange]);

  if (!open) return null;

  const stop = (e) => e.stopPropagation();
  const loaded = ready?.src === src;
  const displaySrc = loaded ? ready.url : fallback ? src : null;
  const showProgress = !loaded && !fallback;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${index + 1} of ${count}`}
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#14120e]/90 p-3 sm:p-8"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <X size={18} />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              onIndexChange((index - 1 + count) % count);
            }}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              stop(e);
              onIndexChange((index + 1) % count);
            }}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {showProgress && (
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/80"
          role="status"
          aria-live="polite"
        >
          <ProgressRing percent={percent} />
          <span className="text-[12.5px]">
            {percent != null ? "Loading image…" : "Preparing preview…"}
          </span>
        </div>
      )}

      {displaySrc && (
        <img
          key={displaySrc}
          src={displaySrc}
          alt=""
          onClick={stop}
          decoding="async"
          className="max-h-full max-w-full rounded-md object-contain shadow-2xl"
        />
      )}

      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[12px] text-white">
          {index + 1} / {count}
        </div>
      )}
    </div>
  );
}
