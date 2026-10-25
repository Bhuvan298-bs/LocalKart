import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, Store, Package } from 'lucide-react';
import ShopHeader from '../../components/shops/ShopHeader.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import Input from '../../components/common/Input.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockShopService } from '../../services/mock/mockShopService.js';
import { mockProductService } from '../../services/mock/mockProductService.js';

export default function ShopDetailsPage({ onShowToast }) {
  const { slug } = useParams();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function loadShopAndProducts() {
      setLoading(true);
      try {
        const foundShop = await mockShopService.getShopBySlug(slug);
        setShop(foundShop);

        if (foundShop) {
          const shopProducts = await mockProductService.getProducts({
            shopId: foundShop.id,
            activeOnly: true
          });
          setProducts(shopProducts);
        }
      } catch (err) {
        console.error('Failed to load shop details', err);
      } finally {
        setLoading(false);
      }
    }

    loadShopAndProducts();
  }, [slug]);

  if (loading) {
    return <LoadingState message="Loading storefront..." />;
  }

  if (!shop) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <EmptyState
          icon={Store}
          title="Store Not Found"
          description="The local shop you requested does not exist or may not yet be approved."
          actionLabel="Browse Available Shops"
          onAction={() => window.location.href = '/shops'}
        />
      </div>
    );
  }

  // Derive unique categories present in this shop's inventory
  const availableCategories = Array.from(new Set(products.map(p => p.category)));

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchTerm.trim() === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase().trim()));

    const matchesCat = activeCategory === 'all' || p.category === activeCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Back to all shops navigation */}
      <div style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-subtle)', padding: 'var(--space-2) 0' }}>
        <div className="container">
          <Link
            to="/shops"
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
            <span>All Local Stores</span>
          </Link>
        </div>
      </div>

      {/* Storefront Hero Header */}
      <ShopHeader shop={shop} />

      {/* Store Catalog Content */}
      <div className="container" style={{ paddingBottom: 'var(--space-12)' }}>
        {/* In-store Search & Category Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            flexWrap: 'wrap'
          }}
        >
          {/* Category Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.4rem 0.85rem',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                border: '1px solid',
                borderColor: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-border)',
                backgroundColor: activeCategory === 'all' ? 'var(--color-primary-light)' : 'var(--color-surface)',
                color: activeCategory === 'all' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              All Items ({products.length})
            </button>

            {availableCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: activeCategory === cat ? 'var(--color-primary-light)' : 'var(--color-surface)',
                  color: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search within store */}
          <div style={{ width: '100%', maxWidth: '320px' }}>
            <Input
              placeholder={`Search ${shop.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              iconLeft={Search}
              style={{ marginBottom: 0 }}
            />
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid
          products={filteredProducts}
          shop={shop}
          emptyTitle={`No items found in ${shop.name}`}
          emptyDescription="Try selecting another category or clearing your search term."
          onShowToast={onShowToast}
        />
      </div>
    </div>
  );
}
