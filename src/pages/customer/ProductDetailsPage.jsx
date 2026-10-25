import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Store, ShieldCheck, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import ProductImage from '../../components/products/ProductImage.jsx';
import StockBadge from '../../components/products/StockBadge.jsx';
import QuantitySelector from '../../components/products/QuantitySelector.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockProductService } from '../../services/mock/mockProductService.js';
import { mockShopService } from '../../services/mock/mockShopService.js';
import { formatINR } from '../../utils/currency.js';
import { useCart } from '../../hooks/useCart.js';

export default function ProductDetailsPage({ onShowToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [shop, setShop] = useState(null);
  const [alternativeShops, setAlternativeShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [showAlternativeDrawer, setShowAlternativeDrawer] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const prod = await mockProductService.getProductById(id);
        setProduct(prod);

        if (prod) {
          const [foundShop, alternatives] = await Promise.all([
            mockShopService.getShopById(prod.shopId),
            mockProductService.getAlternativeShops(prod.id)
          ]);
          setShop(foundShop);
          setAlternativeShops(alternatives || []);

          if (prod.stockQuantity <= 0) {
            setShowAlternativeDrawer(true);
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }

    loadProductData();
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading product information..." />;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <EmptyState
          icon={ShoppingBag}
          title="Product Not Found"
          description="This item might have been removed or is no longer listed in this neighbourhood store."
          actionLabel="Browse Available Shops"
          onAction={() => navigate('/shops')}
        />
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    const success = addToCart(product, quantity, shop);
    if (success && onShowToast) {
      onShowToast({
        type: 'success',
        title: 'Item added to basket',
        message: `${quantity}x ${product.name} added`
      });
    }
  };

  return (
    <div style={{ padding: 'var(--space-4) 0 var(--space-12)' }}>
      <div className="container">
        {/* Navigation Breadcrumbs */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link
            to={shop ? `/shops/${shop.slug}` : '/shops'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to {shop ? shop.name : 'Store'}</span>
          </Link>
        </div>

        {/* Product Purchase Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-8)',
            alignItems: 'start'
          }}
        >
          {/* Left Column: Product Image & Alternative Drawer */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                aspectRatio: '1/1',
                boxShadow: 'var(--shadow-card)',
                marginBottom: 'var(--space-6)',
                position: 'relative'
              }}
            >
              <ProductImage
                src={product.image}
                alt={product.name}
                category={product.category}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                <StockBadge
                  quantity={product.stockQuantity}
                  threshold={product.lowStockThreshold}
                />
              </div>
            </div>

            {/* Fulfilling Shop Info Card */}
            {shop && (
              <div
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-4) var(--space-5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Store size={22} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Sold & Packed by</div>
                    <Link
                      to={`/shops/${shop.slug}`}
                      style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}
                    >
                      {shop.name}
                    </Link>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                      {shop.locality}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/shops/${shop.slug}`}
                  className="btn btn-outline btn-sm"
                >
                  Visit Store
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div
            style={{
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(var(--space-6), 3vw, var(--space-8))',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-primary)', fontWeight: 'bold', marginBottom: 'var(--space-1)' }}>
              {product.brand || 'Local Merchant'} · {product.category}
            </div>

            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>
              {product.name}
            </h1>

            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
              Quantity / Package: <strong>{product.unit}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
              <span className="mono-num" style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                {formatINR(product.price)}
              </span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                Inclusive of all taxes
              </span>
            </div>

            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 'var(--space-6)' }}>
              {product.description}
            </p>

            {/* Quantity Stepper & Add Action */}
            {isOutOfStock ? (
              <div
                style={{
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-error-bg)',
                  border: '1px solid var(--color-error-border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 'var(--space-6)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-error)', fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                  <AlertCircle size={16} />
                  <span>Currently Out of Stock at {shop?.name || 'this store'}</span>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
                  This product has sold out at this local counter. Use our Alternative Shop Finder below to see neighbouring stores that currently have stock.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Quantity</span>
                  <QuantitySelector
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={product.stockQuantity}
                  />
                </div>

                <div style={{ flex: 1, minWidth: '180px', marginTop: 'auto' }}>
                  <Button
                    variant="primary"
                    size="lg"
                    icon={ShoppingBag}
                    style={{ width: '100%' }}
                    onClick={handleAddToCart}
                  >
                    Add {quantity} to Cart · {formatINR(product.price * quantity)}
                  </Button>
                </div>
              </div>
            )}

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} style={{ color: 'var(--color-success)' }} />
                <span>100% Genuine, locally sourced product</span>
              </div>
              <div>
                Estimated Delivery: <strong>Within 45–60 mins</strong> or immediate store pickup.
              </div>
            </div>
          </div>
        </div>

        {/* DISTINCTIVE LOCAL COMMERCE FEATURE: BACKUP SHOP WORKFLOW */}
        <section id="alternatives" style={{ marginTop: 'var(--space-10)' }}>
          <div className="backup-shop-card">
            <div className="backup-header">
              <Sparkles size={18} />
              <span>Neighbourhood Availability Resolver — Alternative Shops</span>
            </div>

            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', maxWidth: '720px', lineHeight: 1.6 }}>
              {isOutOfStock
                ? `Because ${product.name} is out of stock at ${shop?.name || 'this shop'}, LocalKart checked other verified retailers in your neighbourhood with available stock:`
                : `Other nearby local shops also carry ${product.name}. You can compare pricing and availability below:`}
            </p>

            {alternativeShops.length > 0 ? (
              <div className="backup-listings">
                {alternativeShops.map((alt) => (
                  <div key={alt.shopId} className="backup-item">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-primary)' }}>
                          {alt.shopName}
                        </span>
                        <span className="badge-status status-in-stock">
                          {alt.stockQuantity} in stock
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        <MapPin size={12} />
                        <span>{alt.locality} ({alt.distance})</span>
                        <span className="text-separator">·</span>
                        <span>{alt.unit}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <span className="mono-num" style={{ fontWeight: 'bold', fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>
                        {formatINR(alt.price)}
                      </span>

                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          const slugMap = {
                            'shop-1': 'shri-krishna-kirana',
                            'shop-2': 'lakshmi-fresh-produce',
                            'shop-3': 'iyengar-bakery-sweets',
                            'shop-4': 'annapurna-daily-supermarket',
                            'shop-5': 'kaveri-organic-mart',
                            'shop-6': 'balaji-dairy-needs'
                          };
                          const targetSlug = slugMap[alt.shopId] || 'shri-krishna-kirana';
                          navigate(`/shops/${targetSlug}`);
                        }}
                      >
                        View Alternative Shop
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                No other participating store currently lists this exact SKU in your local radius.
              </p>
            )}

            <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: '#fcf7f0', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: '#824b22', border: '1px solid #ebd9c8' }}>
              <strong>Notice:</strong> LocalKart orders are fulfilled individually by each shop to maintain local accountability. Adding items from an alternative shop will start a new order with that respective merchant.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
