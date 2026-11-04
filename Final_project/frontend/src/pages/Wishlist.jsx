import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { items } = useWishlist();
  const { addToCart } = useCart();
  const { fetchWishlist, moveToCart } = useWishlist();

  const handleMove = async (product) => {
    await moveToCart(product, addToCart);
    toast.success('Moved to cart');
  };

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState title="Your wishlist is empty" message="Save items you love for later." icon="❤️" />
        <div style={{ textAlign: 'center' }}><Link to="/shop" className="btn btn-primary">Browse Products</Link></div>
      </div>
    );
  }

  return (
    <div className="container page fade-in">
      <h1 className="section-title">Wishlist</h1>
      <p className="section-sub">{items.length} saved item(s)</p>
      <div className="grid-products">
        {items.map((p) => (
          <div key={p._id} style={{ position: 'relative' }}>
            <ProductCard product={p} />
            <button onClick={() => handleMove(p)} className="btn btn-secondary btn-sm" style={{ position: 'absolute', bottom: 60, left: 12, right: 12 }}>
              Move to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
