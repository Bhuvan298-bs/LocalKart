import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Store, X } from 'lucide-react';
import ShopCard from '../../components/shops/ShopCard.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { mockShopService } from '../../services/mock/mockShopService.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function ShopsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeLocality } = useAuth();

  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [openOnly, setOpenOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('name-asc');

  useEffect(() => {
    async function loadShops() {
      setLoading(true);
      try {
        const filters = {
          status: 'APPROVED',
          search: searchQuery,
          category: selectedCategory,
          isOpen: openOnly ? true : null
        };
        const results = await mockShopService.getShops(filters);

        // Sorting
        results.sort((a, b) => {
          if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
          if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
          if (sortOrder === 'rating') return (b.rating || 0) - (a.rating || 0);
          return 0;
        });

        setShops(results);
      } catch (err) {
        console.error('Failed to load shops', err);
      } finally {
        setLoading(false);
      }
    }

    loadShops();
  }, [searchQuery, selectedCategory, openOnly, sortOrder]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setOpenOnly(false);
    setSortOrder('name-asc');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || openOnly;

  return (
    <div style={{ padding: 'var(--space-8) 0 var(--space-12)' }}>
      <div className="container">
        {/* Page Title & Breadcrumb */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>
            LocalKart · {activeLocality}
          </div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            Neighbourhood Shops & Mandis
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginTop: '0.2rem' }}>
            Direct storefronts for kiranas, fresh produce stalls, and local bakeries nearby.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4) var(--space-5)',
            marginBottom: 'var(--space-6)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--space-3)',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', flex: '1 1 280px', gap: 'var(--space-2)' }}>
            <Input
              placeholder="Search shop name, locality, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              iconLeft={Search}
              className="m-0"
              style={{ marginBottom: 0 }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'groceries', label: 'Kirana & Provisions' },
                { value: 'produce', label: 'Fruits & Vegetables' },
                { value: 'bakery', label: 'Bakery & Sweets' },
                { value: 'dairy', label: 'Dairy & Morning Needs' },
                { value: 'organic', label: 'Organic Mart' }
              ]}
              style={{ marginBottom: 0, minWidth: '170px' }}
            />

            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              options={[
                { value: 'name-asc', label: 'Sort: Name (A-Z)' },
                { value: 'name-desc', label: 'Sort: Name (Z-A)' },
                { value: 'rating', label: 'Sort: Highest Rated' }
              ]}
              style={{ marginBottom: 0, minWidth: '170px' }}
            />

            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                userSelect: 'none'
              }}
            >
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <span>Open Stores Only</span>
            </label>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                icon={X}
                onClick={handleClearFilters}
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <LoadingState message="Discovering neighbourhood shops..." />
        ) : shops.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No neighbourhood shops match your criteria"
            description="Try loosening your search keywords or switching filters to see all available local stores."
            actionLabel="Reset All Filters"
            onAction={handleClearFilters}
          />
        ) : (
          <div className="shops-grid">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
