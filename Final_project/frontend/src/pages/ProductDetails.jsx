import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Rating from '../components/Rating';
import QuantitySelector from '../components/QuantitySelector';
import Loader from '../components/Loader';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaShoppingCart, FaBolt } from 'react-icons/fa';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { isWished, toggle } = useWishlist();
  const { user } = useAuth();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data.data);
      const r = await api.get(`/products/${id}/related`);
      setRelated(r.data.data || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); setActiveImg(0); setQty(1); }, [id]);

  if (loading) return <div className="container page"><Loader /></div>;
  if (!product) return <div className="container page"><p>Product not found.</p></div>;

  const wished = isWished(product._id);
  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAdd = async () => {
    await addToCart(product, qty);
    toast.success('Added to cart');
  };
  const handleBuy = async () => {
    await addToCart(product, qty);
    navigate('/cart');
  };
  const handleWishlist = async () => {
    if (!user) { toast.info('Please login'); return; }
    const now = await toggle(product);
    toast.success(now ? 'Added to wishlist' : 'Removed');
  };
  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to review'); return; }
    setSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, review);
      toast.success('Review submitted');
      setReview({ rating: 5, comment: '' });
      await load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }} className="pd-layout">
        {/* Gallery */}
        <div>
          <div style={{ aspectRatio: '1/1', background: '#f3f4f6', borderRadius: 16, overflow: 'hidden', marginBottom: 12 }}>
            <img src={product.images?.[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{ width: 72, height: 72, borderRadius: 8, overflow: 'hidden', border: activeImg === i ? '2px solid var(--color-primary)' : '1px solid var(--color-border)', padding: 0 }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="text-sm text-muted" style={{ marginBottom: 4 }}>{product.category} • {product.brand}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{product.name}</h1>
          <Rating value={product.rating} count={product.numReviews} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '16px 0' }}>
            <span style={{ fontSize: 30, fontWeight: 800 }}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-muted line-through">₹{product.originalPrice.toLocaleString()}</span>
                <span className="badge badge-danger">-{discount}%</span>
              </>
            )}
          </div>
          <p style={{ color: 'var(--color-muted)', marginBottom: 16, lineHeight: 1.7 }}>{product.description}</p>

          <div style={{ marginBottom: 16 }}>
            {product.stock > 0 ? (
              <span className="badge badge-success">In Stock ({product.stock} available)</span>
            ) : (
              <span className="badge badge-danger">Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
              <QuantitySelector value={qty} onChange={setQty} max={product.stock} />
              <button className="btn btn-primary btn-lg" onClick={handleAdd}><FaShoppingCart /> Add to Cart</button>
              <button className="btn btn-secondary btn-lg" onClick={handleBuy}><FaBolt /> Buy Now</button>
            </div>
          )}
          <button onClick={handleWishlist} className="btn btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {wished ? <FaHeart color="var(--color-danger)" /> : <FaRegHeart />} {wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Product details */}
          <div className="card" style={{ padding: 16, marginTop: 24 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8 }}>Product Details</h3>
            <table style={{ width: '100%', fontSize: 14 }}>
              <tbody>
                {[
                  ['Category', product.category],
                  ['Brand', product.brand],
                  ['Stock', product.stock],
                  ['Rating', `${product.rating} / 5`],
                  ['Reviews', product.numReviews],
                ].map(([k, v]) => (
                  <tr key={k}><td style={{ padding: '6px 0', color: 'var(--color-muted)', width: 120 }}>{k}</td><td style={{ padding: '6px 0', fontWeight: 500 }}>{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section style={{ marginTop: 48 }}>
        <h2 className="section-title">Customer Reviews</h2>
        {product.reviews?.length === 0 ? (
          <p className="text-muted">No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.reviews.map((r, i) => (
              <div key={i} className="card" style={{ padding: 16 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <strong>{r.name}</strong>
                  <Rating value={r.rating} />
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>{r.comment}</p>
                <div className="text-sm text-muted" style={{ marginTop: 4 }}>{new Date(r.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}

        <div className="card" style={{ padding: 20, marginTop: 24, maxWidth: 600 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Write a Review</h3>
          <form onSubmit={handleReview}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Rating</label>
              <select className="input" value={review.rating} onChange={(e) => setReview({ ...review, rating: e.target.value })}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Star{n>1?'s':''}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Comment</label>
              <textarea className="input" rows={3} value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} required />
            </div>
            <button className="btn btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 className="section-title">Related Products</h2>
          <div className="grid-products" style={{ marginTop: 16 }}>{related.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        </section>
      )}

      <style>{`@media(max-width:768px){.pd-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
};

export default ProductDetails;
