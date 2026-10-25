import { useState, useEffect } from 'react';
import { Store, Check, X, ShieldAlert, MapPin, Phone } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { mockShopService } from '../../services/mock/mockShopService.js';

export default function AdminShopsPage({ onShowToast }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    loadShops();
  }, []);

  async function loadShops() {
    setLoading(true);
    try {
      const list = await mockShopService.getShops({ includePending: true });
      setShops(list);
    } catch (err) {
      console.error('Failed to load shops', err);
    } finally {
      setLoading(false);
    }
  }

  const handleApprove = async (shopId) => {
    setActionLoadingId(shopId);
    try {
      const updated = await mockShopService.approveShop(shopId);
      setShops(prev => prev.map(s => (s.id === shopId ? updated : s)));

      if (onShowToast) {
        onShowToast({
          type: 'success',
          title: 'Store Approved',
          message: `${updated.name} is now approved and live for customer browsing.`
        });
      }
    } catch (err) {
      alert(err.message || 'Approval failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (shopId) => {
    setActionLoadingId(shopId);
    try {
      const updated = await mockShopService.rejectShop(shopId);
      setShops(prev => prev.map(s => (s.id === shopId ? updated : s)));

      if (onShowToast) {
        onShowToast({
          type: 'warning',
          title: 'Application Rejected',
          message: `${updated.name} application was rejected.`
        });
      }
    } catch (err) {
      alert(err.message || 'Rejection failed');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredShops = shops.filter(s => {
    if (statusFilter === 'ALL') return true;
    return s.status === statusFilter;
  });

  return (
    <div>
      <PageHeader
        title="Merchant Applications & Onboarding"
        subtitle="Review new shop applications, verify physical retail credentials, and activate local storefronts."
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'ALL', label: `All Shops (${shops.length})` },
          { id: 'PENDING_APPROVAL', label: `Pending Review (${shops.filter(s => s.status === 'PENDING_APPROVAL').length})` },
          { id: 'APPROVED', label: `Approved & Live (${shops.filter(s => s.status === 'APPROVED').length})` },
          { id: 'REJECTED', label: `Declined (${shops.filter(s => s.status === 'REJECTED').length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              border: '1px solid',
              borderColor: statusFilter === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
              backgroundColor: statusFilter === tab.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
              color: statusFilter === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading merchant records..." />
      ) : filteredShops.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No shops in this category"
          description="There are currently no shop records matching this approval filter."
        />
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Store & Owner</th>
                <th>Category</th>
                <th>Locality & Address</th>
                <th>Phone</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Moderation Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Proprietor: {s.ownerName || 'Merchant'}
                    </div>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>
                    {s.category}
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>
                    <div style={{ fontWeight: 500 }}>{s.locality}</div>
                    <div style={{ color: 'var(--color-text-muted)', maxWidth: '240px' }}>{s.address}</div>
                  </td>
                  <td style={{ fontSize: 'var(--font-size-xs)' }}>
                    {s.phone}
                  </td>
                  <td>
                    <span
                      className="badge-status"
                      style={{
                        backgroundColor:
                          s.status === 'APPROVED'
                            ? 'var(--color-success-bg)'
                            : s.status === 'PENDING_APPROVAL'
                            ? 'var(--color-warning-bg)'
                            : 'var(--color-error-bg)',
                        color:
                          s.status === 'APPROVED'
                            ? 'var(--color-success)'
                            : s.status === 'PENDING_APPROVAL'
                            ? 'var(--color-warning)'
                            : 'var(--color-error)',
                        border: `1px solid ${
                          s.status === 'APPROVED'
                            ? 'var(--color-success-border)'
                            : s.status === 'PENDING_APPROVAL'
                            ? 'var(--color-warning-border)'
                            : 'var(--color-error-border)'
                        }`
                      }}
                    >
                      {s.status === 'APPROVED' ? 'Approved' : s.status === 'PENDING_APPROVAL' ? 'Pending Approval' : 'Declined'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 'var(--space-2)' }}>
                      {s.status === 'PENDING_APPROVAL' ? (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            loading={actionLoadingId === s.id}
                            onClick={() => handleApprove(s.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={X}
                            disabled={actionLoadingId === s.id}
                            onClick={() => handleReject(s.id)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : s.status === 'APPROVED' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={X}
                          onClick={() => handleReject(s.id)}
                          style={{ color: 'var(--color-error)' }}
                        >
                          Revoke Approval
                        </Button>
                      ) : (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Check}
                          onClick={() => handleApprove(s.id)}
                        >
                          Re-Approve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
