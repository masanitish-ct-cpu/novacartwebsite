import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import Rating from './Rating';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isWished, toggle } = useWishlist();
  const { user } = useAuth();
  const wished = isWished(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.info('Please login to use wishlist'); return; }
    const nowWished = await toggle(product);
    toast.success(nowWished ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await addToCart(product, 1);
    toast.success('Added to cart');
  };

  const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link to={`/product/${product._id}`} className="card fade-in" style={{ display: 'block', overflow: 'hidden', transition: 'transform .2s, box-shadow .2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
      <div style={{ position: 'relative', aspectRatio: '1/1', background: '#f3f4f6', overflow: 'hidden' }}>
        <img src={product.images?.[0]} alt={product.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {discount > 0 && (
          <span className="badge badge-danger" style={{ position: 'absolute', top: 10, left: 10 }}>-{discount}%</span>
        )}
        {product.isNewArrival && (
          <span className="badge" style={{ position: 'absolute', top: 10, right: 40, background: '#10b981', color: '#fff' }}>New</span>
        )}
        <button onClick={handleWishlist} style={{ position: 'absolute', top: 10, right: 10, background: '#fff', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}>
          {wished ? <FaHeart color="var(--color-danger)" /> : <FaRegHeart />}
        </button>
      </div>
      <div style={{ padding: 14 }}>
        <div className="text-sm text-muted" style={{ marginBottom: 2 }}>{product.category}</div>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6, height: 40, overflow: 'hidden' }}>{product.name}</div>
        <Rating value={product.rating} count={product.numReviews} />
        <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
          <div>
            <span style={{ fontWeight: 700, fontSize: 17 }}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="text-muted line-through" style={{ marginLeft: 6, fontSize: 13 }}>₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
        </div>
        <button onClick={handleAdd} className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
export { ProductCard };
