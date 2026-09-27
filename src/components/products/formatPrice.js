export function formatPrice(price) {
  if (price == null || Number.isNaN(Number(price))) return "—";
  return (
    "₹" + Number(price).toLocaleString("en-IN", { minimumFractionDigits: 2 })
  );
}
