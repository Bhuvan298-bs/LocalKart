import { PackageOpen } from 'lucide-react';
import Button from './Button.jsx';

export default function EmptyState({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records matching your current selection.',
  actionLabel,
  onAction,
  actionVariant = 'primary'
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={44} />
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
