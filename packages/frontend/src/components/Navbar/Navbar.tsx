import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import './Navbar.css';

interface NavbarProps {
  className?: string;
}

const NAV_ITEMS = [
  { label: 'Play', to: '/play' },
  { label: 'Explore', to: '/explore' },
  { label: 'About', to: '/about' },
] as const;

export function Navbar({ className = '' }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const classes = ['navbar', 'glass', className].filter(Boolean).join(' ');

  const isActive = (path: string) => location.pathname === path;

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={classes}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          qxall
        </Link>

        {/* Desktop links */}
        <div className="navbar__links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                'navbar__link',
                isActive(item.to) ? 'navbar__link--active' : '',
              ].filter(Boolean).join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Hamburger button (mobile) */}
        <button
          className={[
            'navbar__hamburger',
            menuOpen ? 'navbar__hamburger--open' : '',
          ].filter(Boolean).join(' ')}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="navbar__hamburger-bar" />
          <span className="navbar__hamburger-bar" />
          <span className="navbar__hamburger-bar" />
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={[
          'navbar__mobile-menu',
          'glass-elevated',
          menuOpen ? 'navbar__mobile-menu--open' : '',
        ].filter(Boolean).join(' ')}
      >
        <div className="navbar__mobile-links">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={[
                'navbar__mobile-link',
                isActive(item.to) ? 'navbar__mobile-link--active' : '',
              ].filter(Boolean).join(' ')}
              onClick={handleMobileLinkClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
