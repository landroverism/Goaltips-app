
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/reset-password';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout;
