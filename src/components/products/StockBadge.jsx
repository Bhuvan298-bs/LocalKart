export default function StockBadge({ quantity = 0, threshold = 5 }) {
  const qty = Number(quantity);
  const thresh = Number(threshold);

  if (qty <= 0) {
    return (
      <span className="badge-status status-out-of-stock">
        Out of Stock
      </span>
    );
  }

  if (qty <= thresh) {
    return (
      <span className="badge-status status-low-stock">
        Only {qty} left
      </span>
    );
  }

  return (
    <span className="badge-status status-in-stock">
      In Stock
    </span>
  );
}
