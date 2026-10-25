import { getStatusLabel, getStatusBadgeClass } from '../../utils/orderStatus.js';

export default function OrderStatusBadge({ status }) {
  const badgeClass = getStatusBadgeClass(status);
  const label = getStatusLabel(status);

  return (
    <span className={`badge-status ${badgeClass}`}>
      {label}
    </span>
  );
}
