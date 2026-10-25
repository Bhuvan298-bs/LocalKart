import ProductCard from './ProductCard.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { ShoppingBag } from 'lucide-react';

export default function ProductGrid({
  products = [],
  shop = null,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search or category filter.',
  onShowToast
}) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="products-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          shop={shop}
          onShowToast={onShowToast}
        />
      ))}
    </div>
  );
}
