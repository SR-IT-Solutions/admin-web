export default function StatusMessage({ tone = "muted", children }) {
  if (!children) return null;

  const toneClass =
    tone === "error"
      ? "text-danger"
      : tone === "ok"
      ? "text-accent"
      : "text-muted";

  return <p className={`mt-2.5 text-[13px] ${toneClass}`}>{children}</p>;
}
