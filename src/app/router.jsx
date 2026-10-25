import { Routes, Route } from 'react-router-dom';

// Layouts
import CustomerLayout from '../components/layout/CustomerLayout.jsx';
import SellerLayout from '../components/layout/SellerLayout.jsx';
import AdminLayout from '../components/layout/AdminLayout.jsx';

// Customer Pages
import HomePage from '../pages/customer/HomePage.jsx';
import ShopsPage from '../pages/customer/ShopsPage.jsx';
import ShopDetailsPage from '../pages/customer/ShopDetailsPage.jsx';
import ProductDetailsPage from '../pages/customer/ProductDetailsPage.jsx';
import CartPage from '../pages/customer/CartPage.jsx';
import CheckoutPage from '../pages/customer/CheckoutPage.jsx';
import CustomerOrdersPage from '../pages/customer/CustomerOrdersPage.jsx';
import OrderDetailsPage from '../pages/customer/OrderDetailsPage.jsx';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import SellerLoginPage from '../pages/seller/SellerLoginPage.jsx';
import SellerRegisterPage from '../pages/seller/SellerRegisterPage.jsx';

// Seller Pages
import SellerDashboardPage from '../pages/seller/SellerDashboardPage.jsx';
import SellerProductsPage from '../pages/seller/SellerProductsPage.jsx';
import SellerProductFormPage from '../pages/seller/SellerProductFormPage.jsx';
import SellerOrdersPage from '../pages/seller/SellerOrdersPage.jsx';
import SellerOrderDetailsPage from '../pages/seller/SellerOrderDetailsPage.jsx';
import SellerStoreSettingsPage from '../pages/seller/SellerStoreSettingsPage.jsx';

// Admin Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage.jsx';
import AdminShopsPage from '../pages/admin/AdminShopsPage.jsx';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage.jsx';
import AdminDeliveriesPage from '../pages/admin/AdminDeliveriesPage.jsx';

// 404
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function AppRoutes({ onShowToast }) {
  return (
    <Routes>
      {/* Customer Experience Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<HomePage onShowToast={onShowToast} />} />
        <Route path="/shops" element={<ShopsPage onShowToast={onShowToast} />} />
        <Route path="/shops/:slug" element={<ShopDetailsPage onShowToast={onShowToast} />} />
        <Route path="/products/:id" element={<ProductDetailsPage onShowToast={onShowToast} />} />
        <Route path="/cart" element={<CartPage onShowToast={onShowToast} />} />
        <Route path="/checkout" element={<CheckoutPage onShowToast={onShowToast} />} />
        <Route path="/orders" element={<CustomerOrdersPage onShowToast={onShowToast} />} />
        <Route path="/orders/:id" element={<OrderDetailsPage onShowToast={onShowToast} />} />

        {/* Customer Auth */}
        <Route path="/login" element={<LoginPage onShowToast={onShowToast} />} />
        <Route path="/register" element={<RegisterPage onShowToast={onShowToast} />} />

        {/* Merchant Auth from Customer Header */}
        <Route path="/seller/login" element={<SellerLoginPage onShowToast={onShowToast} />} />
        <Route path="/seller/register" element={<SellerRegisterPage onShowToast={onShowToast} />} />

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Shopkeeper Dashboard Routes */}
      <Route path="/seller" element={<SellerLayout />}>
        <Route path="dashboard" element={<SellerDashboardPage onShowToast={onShowToast} />} />
        <Route path="products" element={<SellerProductsPage onShowToast={onShowToast} />} />
        <Route path="products/new" element={<SellerProductFormPage onShowToast={onShowToast} />} />
        <Route path="products/:id/edit" element={<SellerProductFormPage onShowToast={onShowToast} />} />
        <Route path="orders" element={<SellerOrdersPage onShowToast={onShowToast} />} />
        <Route path="orders/:id" element={<SellerOrderDetailsPage onShowToast={onShowToast} />} />
        <Route path="store" element={<SellerStoreSettingsPage onShowToast={onShowToast} />} />
      </Route>

      {/* Administrator Operations Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboardPage onShowToast={onShowToast} />} />
        <Route path="shops" element={<AdminShopsPage onShowToast={onShowToast} />} />
        <Route path="orders" element={<AdminOrdersPage onShowToast={onShowToast} />} />
        <Route path="deliveries" element={<AdminDeliveriesPage onShowToast={onShowToast} />} />
      </Route>
    </Routes>
  );
}
