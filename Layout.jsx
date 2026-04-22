import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import styles from './Layout.module.css';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button className={styles.logo} onClick={() => navigate('/')}>
            <span className={styles.logoMark}>VG</span>
            <span className={styles.logoText}>VendorGuard</span>
          </button>
          <nav className={styles.nav}>
            <NavLink to="/assess" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              New Assessment
            </NavLink>
            <NavLink to="/history" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              History
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
              Settings
            </NavLink>
          </nav>
          <button className={styles.ctaBtn} onClick={() => navigate('/assess')}>
            Run Assessment
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <span>VendorGuard © {new Date().getFullYear()}</span>
        <span className={styles.footerSep}>·</span>
        <span>AI-powered vendor risk assessment</span>
      </footer>
    </div>
  );
}