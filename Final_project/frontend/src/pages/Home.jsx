import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import Loader, { SkeletonCard } from '../components/Loader';
import { toast } from 'react-toastify';

const categories = ['Electronics','Fashion','Footwear','Accessories','Home & Living','Beauty','Sports'];
const catImages = {
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',
  Fashion: 'https://images.unsplash.com/photo-1445205172267-88bb8225ab1c?auto=format&fit=crop&w=600&q=80',
  Footwear: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=600&q=80',
  Accessories: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
  'Home & Living': 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80',
  Beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
  Sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
};

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [f, n] = await Promise.all([
          api.get('/products?featured=true&limit=8'),
          api.get('/products?sort=newest&limit=8'),
        ]);
        // featured flag not filtered by backend query param 'featured'? We added support? Let's check: getProducts doesn't handle featured param. We'll filter client-side from all products maybe. Instead fetch all and filter.
      } catch {}
    })();
  }, []);

  // Better: fetch products and filter
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products?limit=40');
        const all = data.data || [];
        setFeatured(all.filter(p => p.featured).slice(0, 8));
        setNewArrivals(all.filter(p => p.isNewArrival).slice(0, 8));
        if (all.filter(p => p.featured).length === 0) setFeatured(all.slice(0, 8));
        if (all.filter(p => p.isNewArrival).length === 0) setNewArrivals(all.slice(8, 16));
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="fade-in">
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #60a5fa 100%)', color: '#fff', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <span className="badge" style={{ background: 'rgba(255,255,255,.2)', color: '#fff', marginBottom: 16 }}>New Season Collection</span>
            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>Upgrade Your Everyday</h1>
            <p style={{ fontSize: 18, opacity: .9, marginBottom: 28, maxWidth: 480 }}>
              Discover curated products across electronics, fashion, beauty and more. Premium quality, delivered to your door.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/shop" className="btn btn-lg" style={{ background: '#fff', color: 'var(--color-primary)' }}>Shop Now</Link>
              <Link to="/shop?sort=newest" className="btn btn-lg btn-secondary" style={{ background: 'transparent', color: '#fff', borderColor: 'rgba(255,255,255,.5)' }}>Explore Collection</Link>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80" alt="hero" style={{ borderRadius: 24, boxShadow: '0 30px 60px rgba(0,0,0,.3)', maxWidth: '100%' }} />
          </div>
        </div>
        <style>{`@media(max-width:768px){.container>div:last-child{display:none}.container{grid-template-columns:1fr}}`}</style>
      </section>

      {/* Categories */}
      <section className="container page">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-sub">Find what you love</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {categories.map((c) => <CategoryCard key={c} name={c} image={catImages[c]} />)}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ paddingBottom: 32 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <h2 className="section-title" style={{ margin: 0 }}>Featured Products</h2>
          <Link to="/shop" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <p className="section-sub">Hand-picked for you</p>
        {loading ? (
          <div className="grid-products">{Array.from({length:8}).map((_,i)=><SkeletonCard key={i}/>)}</div>
        ) : (
          <div className="grid-products">{featured.map(p => <ProductCard key={p._id} product={p} />)}</div>
        )}
      </section>

      {/* Promo banner */}
      <section className="container" style={{ margin: '32px auto' }}>
        <div style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', borderRadius: 24, padding: '48px 40px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Mega Sale — Up to 50% Off</h2>
            <p style={{ opacity: .9 }}>Limited time. Don't miss out on our biggest discounts.</p>
          </div>
          <Link to="/shop" className="btn btn-lg" style={{ background: '#fff', color: '#ef4444' }}>Shop the Sale</Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container" style={{ paddingBottom: 32 }}>
        <h2 className="section-title">New Arrivals</h2>
        <p className="section-sub">Freshly added to the store</p>
        {loading ? (
          <div className="grid-products">{Array.from({length:4}).map((_,i)=><SkeletonCard key={i}/>)}</div>
        ) : (
          <div className="grid-products">{newArrivals.map(p => <ProductCard key={p._id} product={p} />)}</div>
        )}
      </section>

      {/* Why shop */}
      <section className="container" style={{ paddingBottom: 32 }}>
        <h2 className="section-title" style={{ textAlign: 'center' }}>Why Shop With Us</h2>
        <p className="section-sub" style={{ textAlign: 'center' }}>We care about your experience</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[
            { icon: <FaTruck />, title: 'Free Shipping', desc: 'On orders over ₹999' },
            { icon: <FaShieldAlt />, title: 'Secure Payments', desc: '100% protected checkout' },
            { icon: <FaUndo />, title: 'Easy Returns', desc: '7-day return policy' },
            { icon: <FaHeadset />, title: 'Customer Support', desc: '24/7 dedicated help' },
          ].map((b) => (
            <div key={b.title} className="card" style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 32, color: 'var(--color-primary)', marginBottom: 12 }}>{b.icon}</div>
              <h3 style={{ fontSize: 16, marginBottom: 4 }}>{b.title}</h3>
              <p className="text-muted text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section style={{ background: 'var(--color-primary-light)', padding: '48px 0' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 560 }}>
          <h2 className="section-title">Join our newsletter</h2>
          <p className="section-sub">Get updates on new arrivals and exclusive offers.</p>
          <form onSubmit={(e) => { e.preventDefault(); toast.success('Subscribed!'); }} style={{ display: 'flex', gap: 8 }}>
            <input className="input" placeholder="Enter your email" type="email" required />
            <button className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
