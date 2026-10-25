import { useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import ProductImage from './ProductImage.jsx';
import StockBadge from './StockBadge.jsx';
import Button from '../common/Button.jsx';
import { formatINR } from '../../utils/currency.js';
import { useCart } from '../../hooks/useCart.js';

export default function ProductCard({ product, shop = null, onShowToast }) {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const isOutOfStock = product.stockQuantity <= 0;
  const inCartItem = items.find(i => i.id === product.id);
  const cartQty = inCartItem?.quantity || 0;

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const added = addToCart(product, 1, shop);
    if (added && onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Added to cart',
        message: `${product.name} (1 ${product.unit}) added`
      });
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="product-media">
        <ProductImage
          src={product.image}
          alt={product.name}
          category={product.category}
        />
        <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
          <StockBadge
            quantity={product.stockQuantity}
            threshold={product.lowStockThreshold}
          />
        </div>
      </div>

      <div className="product-body">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand || 'Local Merchant'}</span>
          <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
        </div>

        <h4 className="product-title" title={product.name}>
          {product.name}
        </h4>

        <div className="product-unit">{product.unit}</div>

        <div className="product-footer">
          <div className="product-price mono-num">
            {formatINR(product.price)}
          </div>

          {isOutOfStock ? (
            <Button
              variant="outline"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/products/${product.id}#alternatives`);
              }}
              title="Find another local shop carrying this item"
            >
              Alternative
            </Button>
          ) : (
            <Button
              variant={cartQty > 0 ? 'secondary' : 'primary'}
              size="sm"
              icon={ShoppingBag}
              onClick={handleAdd}
              disabled={isOutOfStock}
            >
              {cartQty > 0 ? `In Cart (${cartQty})` : 'Add'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
