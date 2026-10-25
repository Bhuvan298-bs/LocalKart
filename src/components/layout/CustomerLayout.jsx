import { Outlet } from 'react-router-dom';
import CustomerHeader from './CustomerHeader.jsx';
import CustomerFooter from './CustomerFooter.jsx';
import MobileNavigation from './MobileNavigation.jsx';

export default function CustomerLayout() {
  return (
    <>
      <CustomerHeader />
      <main style={{ flex: 1, minHeight: 'calc(100vh - 140px)' }}>
        <Outlet />
      </main>
      <CustomerFooter />
      <MobileNavigation />
    </>
  );
}
