import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const { items: wish } = useWishlist();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    toast.success('Logged out');
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/shop?sort=newest', label: 'New Arrivals' },
    { to: '/shop?sort=popular', label: 'Deals' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', borderBottom: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, height: 68 }}>
        <Link to="/" style={{ fontWeight: 800, fontSize: 22, color: 'var(--color-primary)', letterSpacing: -0.5 }}>
          Nova<span style={{ color: 'var(--color-text)' }}>Cart</span>
        </Link>

        <nav className="desktop-nav" style={{ display: 'flex', gap: 4, marginLeft: 16 }}>
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} style={{ padding: '8px 12px', borderRadius: 8, fontWeight: 500, fontSize: 14, color: location.pathname === l.to ? 'var(--color-primary)' : 'var(--color-text)' }}>
              {l.label}
            </Link>
          ))}
          <Link to="/shop" style={{ padding: '8px 12px', borderRadius: 8, fontWeight: 500, fontSize: 14 }}>Categories</Link>
        </nav>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 420, marginLeft: 'auto', position: 'relative' }} className="search-form">
          <FaSearch style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-muted)' }} />
          <input className="input" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 36 }} />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/wishlist" style={{ position: 'relative', padding: 8 }}>
            <FaHeart size={18} />
            {wish.length > 0 && <span className="badge badge-danger" style={{ position: 'absolute', top: 0, right: 0, minWidth: 18, justifyContent: 'center' }}>{wish.length}</span>}
          </Link>
          <Link to="/cart" style={{ position: 'relative', padding: 8 }}>
            <FaShoppingCart size={18} />
            {count > 0 && <span className="badge" style={{ position: 'absolute', top: 0, right: 0, minWidth: 18, justifyContent: 'center' }}>{count}</span>}
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setUserMenu(!userMenu)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: 8, fontWeight: 500 }}>
                <FaUser /> <span className="hide-sm">{user.name?.split(' ')[0]}</span>
              </button>
              {userMenu && (
                <div className="card" style={{ position: 'absolute', right: 0, top: 44, width: 200, padding: 8, zIndex: 60 }}>
                  <Link to="/profile" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '8px 12px', borderRadius: 6 }}>Profile</Link>
                  <Link to="/profile?tab=orders" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '8px 12px', borderRadius: 6 }}>Orders</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setUserMenu(false)} style={{ display: 'block', padding: '8px 12px', borderRadius: 6, color: 'var(--color-primary)' }}>Admin Dashboard</Link>}
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '8px 12px', borderRadius: 6, color: 'var(--color-danger)' }}>
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}

          <button className="hamburger" onClick={() => setOpen(!open)} style={{ padding: 8, display: 'none' }}>
            {open ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ padding: 16, borderTop: '1px solid var(--color-border)', background: '#fff' }}>
          <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: 12 }}>
            <FaSearch style={{ position: 'absolute', left: 12, top: 11, color: 'var(--color-muted)' }} />
            <input className="input" placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ paddingLeft: 36 }} />
          </form>
          {navLinks.map((l) => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 4px', fontWeight: 500 }}>{l.label}</Link>
          ))}
          <Link to="/shop" onClick={() => setOpen(false)} style={{ display: 'block', padding: '10px 4px', fontWeight: 500 }}>Categories</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .search-form { display: none !important; }
          .hamburger { display: inline-flex !important; }
          .hide-sm { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
