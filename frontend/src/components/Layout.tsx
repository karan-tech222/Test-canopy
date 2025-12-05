import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { path: '/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/calculate', name: 'Calculate', icon: '🧮' },
    { path: '/history', name: 'History', icon: '📜' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="app-layout">
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/canopy-logo.svg" alt="Canopy Logo" className="logo-icon" />
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="footer-info">
            <p>Allocation Proration Tool</p>
            <p className="version">Version 1.0.0</p>
          </div>
        </div>
      </aside>

      <div className="main-content">
        <header className="app-header">
          <button 
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            ☰
          </button>
          <h1 className="page-title">
            {navigation.find(item => isActive(item.path))?.name || 'Canopy'}
          </h1>
          <div className="header-actions">
            <div className="user-info">
              <span className="user-avatar">👤</span>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>

      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
