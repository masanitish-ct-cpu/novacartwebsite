import { Link } from 'react-router-dom';

const icons = {
  Electronics: '📱',
  Fashion: '👗',
  Footwear: '👟',
  Accessories: '👜',
  'Home & Living': '🏠',
  Beauty: '💄',
  Sports: '🏃',
};

const CategoryCard = ({ name, image }) => (
  <Link to={`/shop?category=${encodeURIComponent(name)}`} className="card" style={{ overflow: 'hidden', display: 'block', transition: 'transform .2s' }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
    <div style={{ aspectRatio: '4/3', background: '#f3f4f6', overflow: 'hidden', position: 'relative' }}>
      {image ? <img src={image} alt={name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>{icons[name]}</div>}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55), transparent)' }} />
      <div style={{ position: 'absolute', bottom: 12, left: 12, color: '#fff', fontWeight: 700, fontSize: 16 }}>{icons[name]} {name}</div>
    </div>
  </Link>
);
export default CategoryCard;
