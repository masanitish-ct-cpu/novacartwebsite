import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer style={{ background: '#111827', color: '#d1d5db', marginTop: 64 }}>
    <div className="container" style={{ padding: '48px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color: '#fff', marginBottom: 8 }}>Nova<span style={{ color: 'var(--color-primary)' }}>Cart</span></div>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>Discover. Shop. Love. Your premium shopping destination.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <FaFacebook /><FaInstagram /><FaTwitter /><FaYoutube />
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Shop</h4>
          {['Electronics','Fashion','Footwear','Accessories','Home & Living','Beauty','Sports'].map(c => (
            <Link key={c} to={`/shop?category=${encodeURIComponent(c)}`} style={{ display: 'block', fontSize: 14, marginBottom: 6, color: '#9ca3af' }}>{c}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Customer Service</h4>
          {['Contact Us','Shipping Info','Returns','FAQ'].map(t => <div key={t} style={{ fontSize: 14, marginBottom: 6, color: '#9ca3af' }}>{t}</div>)}
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: 12 }}>Company</h4>
          {['About NovaCart','Privacy Policy','Terms & Conditions','Careers'].map(t => <div key={t} style={{ fontSize: 14, marginBottom: 6, color: '#9ca3af' }}>{t}</div>)}
        </div>
      </div>
    </div>
    <div style={{ borderTop: '1px solid #1f2937', padding: '16px 24px', textAlign: 'center', fontSize: 13, color: '#6b7280' }}>
      © {new Date().getFullYear()} NovaCart. All rights reserved.
    </div>
  </footer>
);
export default Footer;
