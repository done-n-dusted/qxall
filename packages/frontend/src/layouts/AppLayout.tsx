import { Outlet } from 'react-router';
import { Navbar } from '../components';
import './AppLayout.css';

export function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
