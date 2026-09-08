export default function EmptyState({ children }) {
  return (
    <div className="rounded-lg border border-dashed border-border py-16 text-center text-[14px] text-muted">
      {children}
    </div>
  );
}
