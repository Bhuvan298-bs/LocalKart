import { Outlet } from 'react-router-dom';
import SellerSidebar from './SellerSidebar.jsx';
import DashboardHeader from './DashboardHeader.jsx';

export default function SellerLayout() {
  return (
    <div className="dashboard-layout">
      <SellerSidebar />
      <div className="dashboard-main">
        <DashboardHeader title="Seller Center" roleLabel="Shopkeeper Portal" />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
