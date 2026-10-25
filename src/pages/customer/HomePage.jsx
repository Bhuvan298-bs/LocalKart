import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Store, ShieldCheck, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import CategoryNavigation from '../../components/shops/CategoryNavigation.jsx';
import ShopCard from '../../components/shops/ShopCard.jsx';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import Button from '../../components/common/Button.jsx';
import ProductImage from '../../components/products/ProductImage.jsx';
import { mockShopService } from '../../services/mock/mockShopService.js';
import { mockProductService } from '../../services/mock/mockProductService.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';

export default function HomePage({ onShowToast }) {
  const navigate = useNavigate();
  const { activeLocality } = useAuth();

  const [featuredShops, setFeaturedShops] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [shops, products] = await Promise.all([
          mockShopService.getShops({ status: 'APPROVED' }),
          mockProductService.getProducts({ activeOnly: true })
        ]);

        setFeaturedShops(shops.slice(0, 3));
        setPopularProducts(products.slice(0, 8));
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const handleSelectCategory = (categoryId) => {
    if (categoryId === 'all') {
      navigate('/shops');
    } else {
      navigate(`/shops?category=${categoryId}`);
    }
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-kicker">
                <Store size={14} />
                <span>Support Your Local Retailers</span>
              </div>

              <h1 className="hero-title">
                Your neighbourhood, <span>delivered.</span>
              </h1>

              <p className="hero-subtitle">
                Discover your local kirana shops, fresh vegetable mandis, and neighbourhood bakeries in <strong>{activeLocality.split(',')[0]}</strong>. Get fresh daily essentials packed by shopkeepers you know and trust.
              </p>

              <div className="hero-actions">
                <Button
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => navigate('/shops')}
                >
                  Explore Nearby Shops
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  icon={Store}
                  onClick={() => navigate('/seller/register')}
                >
                  Register Your Shop
                </Button>
              </div>

              <div className="hero-trust-bar">
                <div className="hero-trust-item">
                  <CheckCircle2 size={15} style={{ color: 'var(--color-success)' }} />
                  <span>Verified Local Kiranas</span>
                </div>
                <div className="hero-trust-item">
                  <CheckCircle2 size={15} style={{ color: 'var(--color-success)' }} />
                  <span>Fair MRP & Fresh Produce</span>
                </div>
                <div className="hero-trust-item">
                  <CheckCircle2 size={15} style={{ color: 'var(--color-success)' }} />
                  <span>Pay on Delivery / Pickup</span>
                </div>
              </div>
            </div>

            <div className="hero-visual-card">
              <div className="hero-image-wrapper">
                <ProductImage
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80"
                  alt="Neighbourhood store fresh vegetables and pulses"
                  category="grocery"
                />
              </div>
              <div className="hero-visual-footer">
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)' }}>
                    Serving {activeLocality}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                    5 verified shops ready to deliver today
                  </div>
                </div>

                <Link to="/shops" className="btn btn-outline btn-sm">
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES BROWSER */}
      <section style={{ padding: 'var(--space-10) 0' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">
                Select a category to discover local stores specializing in your essentials
              </p>
            </div>
          </div>

          <CategoryNavigation onSelectCategory={handleSelectCategory} />
        </div>
      </section>

      {/* 3. POPULAR NEARBY SHOPS */}
      <section style={{ padding: '0 0 var(--space-10)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Local Stores</h2>
              <p className="section-subtitle">
                Trusted neighbourhood retailers in {activeLocality.split(',')[0]}
              </p>
            </div>
            <Link to="/shops" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-primary)' }}>
              <span>View all shops</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="shops-grid">
            {featuredShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. POPULAR DAILY ESSENTIALS */}
      <section style={{ padding: 'var(--space-8) 0 var(--space-12)', backgroundColor: 'var(--color-surface-subtle)' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Popular Neighbourhood Essentials</h2>
              <p className="section-subtitle">
                Fresh milk, staples, fresh vegetables, and bakery favorites in stock today
              </p>
            </div>
          </div>

          <ProductGrid
            products={popularProducts}
            onShowToast={onShowToast}
          />
        </div>
      </section>

      {/* 5. DISTINCTIVE FEATURE SPOTLIGHT: BACKUP SHOP WORKFLOW */}
      <section style={{ padding: 'var(--space-12) 0', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#fffdf9',
              border: '1px solid #ebd9c8',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(var(--space-6), 4vw, var(--space-10))',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-accent)', fontSize: 'var(--font-size-xs)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)' }}>
                <Sparkles size={14} />
                <span>LocalKart Exclusive Feature</span>
              </div>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)' }}>
                Item out of stock? We help you find alternative nearby shops.
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                Unlike centralized warehouse delivery apps that cancel out-of-stock items, LocalKart connects neighbourhood retailers. When your favourite store is out of pulses, milk, or vegetables, explore immediate participating local stores within 2 km without leaving empty-handed.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate('/products/prod-104')}
                icon={ArrowRight}
                iconPosition="right"
              >
                Try Interactive Demo (Out of Stock Item)
              </Button>
            </div>

            <div
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid #e4dfd7',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                boxShadow: 'var(--shadow-subtle)'
              }}
            >
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
                Simulated Availability Resolver
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', background: '#fdf2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c53030', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  0 QTY
                </div>
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>Toor Dal Unpolished 1 kg</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error)' }}>Out of stock at Shri Krishna Kirana</div>
                </div>
              </div>

              <div style={{ padding: 'var(--space-3)', backgroundColor: '#fdfbf7', border: '1px dashed #ebd9c8', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-accent)', marginBottom: '0.2rem' }}>
                  Available at Annapurna Supermarket (3.2 km away)
                </div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
                  In stock: 24 units · ₹160/kg · Ready for pickup or delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section style={{ padding: 'var(--space-12) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-8)' }}>
            <h2 className="section-title">How LocalKart Works</h2>
            <p className="section-subtitle">
              Three straightforward steps to shop conveniently while backing your community.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
                01
              </div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                Choose Your Local Shop
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Browse verified kirana stores, dairies, and bakeries in your immediate locality. Each store manages its own catalog and pricing.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
                02
              </div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                Hand-Packed by Storekeepers
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Your order is confirmed and hand-picked directly by the shop owner who knows their produce and stock inside out.
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: 'var(--space-4)' }}>
                03
              </div>
              <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>
                Doorstep Delivery or Pickup
              </h3>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Opt for prompt local partner delivery or pick up your packed basket on your evening walk. Pay via cash or UPI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA FOR SHOPKEEPERS */}
      <section style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: 'var(--space-10) 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'bold', color: 'white', marginBottom: 'var(--space-2)' }}>
              Do you operate a neighbourhood shop?
            </h2>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-subtle)', maxWidth: '540px', lineHeight: 1.6 }}>
              Join LocalKart to create your digital shopfront in under 10 minutes. Receive orders from nearby families, manage stock with ease, and grow your local commerce.
            </p>
          </div>

          <Button
            variant="secondary"
            size="lg"
            icon={Store}
            onClick={() => navigate('/seller/register')}
            style={{ backgroundColor: 'white', color: 'var(--color-primary)', borderColor: 'white' }}
          >
            Create Your Free Digital Store
          </Button>
        </div>
      </section>
    </div>
  );
}
