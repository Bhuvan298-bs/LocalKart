import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, AlertTriangle, Package, Check, X } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import StockBadge from '../../components/products/StockBadge.jsx';
import ProductImage from '../../components/products/ProductImage.jsx';
import Input from '../../components/common/Input.jsx';
import Select from '../../components/common/Select.jsx';
import Button from '../../components/common/Button.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockProductService } from '../../services/mock/mockProductService.js';
import { formatINR } from '../../utils/currency.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function SellerProductsPage({ onShowToast }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const shopId = user?.shopId || 'shop-1';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState(searchParams.get('filter') || 'all');

  // Delete modal state
  const [deleteProductTarget, setDeleteProductTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [shopId]);

  async function loadProducts() {
    setLoading(true);
    try {
      const list = await mockProductService.getProducts({ shopId });
      setProducts(list);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }

  const handleToggleActive = async (product) => {
    try {
      const updated = await mockProductService.updateProduct(product.id, {
        isActive: !product.isActive
      });
      setProducts(prev => prev.map(p => (p.id === product.id ? updated : p)));

      if (onShowToast) {
        onShowToast({
          type: 'info',
          title: updated.isActive ? 'Product Activated' : 'Product Deactivated',
          message: `${updated.name} is now ${updated.isActive ? 'visible' : 'hidden'} on your storefront.`
        });
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductTarget) return;
    setDeleteLoading(true);
    try {
      await mockProductService.deleteProduct(deleteProductTarget.id);
      setProducts(prev => prev.filter(p => p.id !== deleteProductTarget.id));
      setDeleteProductTarget(null);

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Product Deleted',
          message: `${deleteProductTarget.name} was removed from your catalog.`
        });
      }
    } catch (err) {
      alert('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = searchTerm.trim() === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase().trim()));

    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;

    let matchesStock = true;
    if (stockFilter === 'low') {
      matchesStock = p.stockQuantity > 0 && p.stockQuantity <= (p.lowStockThreshold || 5);
    } else if (stockFilter === 'out') {
      matchesStock = p.stockQuantity <= 0;
    } else if (stockFilter === 'in') {
      matchesStock = p.stockQuantity > (p.lowStockThreshold || 5);
    }

    return matchesSearch && matchesCat && matchesStock;
  });

  return (
    <div>
      <PageHeader
        title="Product Inventory Catalog"
        subtitle="Manage product pricing, units, stock quantities, and storefront visibility."
        action={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/seller/products/new')}
          >
            Add New Product
          </Button>
        }
      />

      {/* Filter Bar */}
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
        <div style={{ flex: '1 1 260px' }}>
          <Input
            placeholder="Search your inventory by name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            iconLeft={Search}
            style={{ marginBottom: 0 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'groceries', label: 'Groceries & Staples' },
              { value: 'produce', label: 'Produce' },
              { value: 'dairy', label: 'Dairy' },
              { value: 'bakery', label: 'Bakery' },
              { value: 'snacks', label: 'Snacks' },
              { value: 'beverages', label: 'Beverages' },
              { value: 'household', label: 'Household' },
              { value: 'spices', label: 'Spices' }
            ]}
            style={{ marginBottom: 0, minWidth: '160px' }}
          />

          <Select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Stock Levels' },
              { value: 'in', label: 'In Stock (> Threshold)' },
              { value: 'low', label: 'Low Stock Only' },
              { value: 'out', label: 'Out of Stock (0)' }
            ]}
            style={{ marginBottom: 0, minWidth: '160px' }}
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Loading store catalog..." />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products matched your filters"
          description="Try clearing your search query or stock filter to view all products."
          actionLabel="Reset Search & Filters"
          onAction={() => {
            setSearchTerm('');
            setCategoryFilter('all');
            setStockFilter('all');
          }}
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Item</th>
                <th>Product Name & Brand</th>
                <th>Category</th>
                <th>Price (INR)</th>
                <th>Package Unit</th>
                <th>Stock Qty</th>
                <th>Stock Status</th>
                <th>Listing Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <ProductImage
                      src={p.image}
                      alt={p.name}
                      category={p.category}
                      className="table-thumbnail"
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      {p.brand || 'Local Merchant'}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: 'var(--font-size-xs)' }}>
                    {p.category}
                  </td>
                  <td>
                    <span className="mono-num" style={{ fontWeight: 'bold' }}>
                      {formatINR(p.price)}
                    </span>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>
                    {p.unit}
                  </td>
                  <td>
                    <span className="mono-num" style={{ fontWeight: 'bold', fontSize: 'var(--font-size-sm)' }}>
                      {p.stockQuantity}
                    </span>
                  </td>
                  <td>
                    <StockBadge
                      quantity={p.stockQuantity}
                      threshold={p.lowStockThreshold}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(p)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: '1px solid',
                        borderColor: p.isActive ? 'var(--color-success-border)' : 'var(--color-border)',
                        backgroundColor: p.isActive ? 'var(--color-success-bg)' : 'var(--color-surface-subtle)',
                        color: p.isActive ? 'var(--color-success)' : 'var(--color-text-muted)'
                      }}
                    >
                      {p.isActive ? (
                        <>
                          <Check size={12} />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <X size={12} />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-1)' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/seller/products/${p.id}/edit`)}
                        className="btn btn-ghost btn-icon-only"
                        title="Edit product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteProductTarget(p)}
                        className="btn btn-ghost btn-icon-only"
                        style={{ color: 'var(--color-error)' }}
                        title="Delete product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteProductTarget}
        title="Delete Product?"
        message={`Are you sure you want to permanently delete "${deleteProductTarget?.name}"? This action cannot be undone in this demo.`}
        confirmLabel="Delete Product"
        cancelLabel="Keep Product"
        isDestructive={true}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteProductTarget(null)}
      />
    </div>
  );
}
