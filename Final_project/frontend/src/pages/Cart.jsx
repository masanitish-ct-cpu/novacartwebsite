import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/QuantitySelector';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

const Cart = () => {
  const { items, updateQty, remove, clear, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (items.length === 0) {
    return (
      <div className="container page">
        <EmptyState title="Your cart is empty" message="Looks like you haven't added anything yet." icon="🛒" />
        <div style={{ textAlign: 'center' }}>
          <Link to="/shop" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page fade-in">
      <h1 className="section-title">Shopping Cart</h1>
      <p className="section-sub">{items.length} item(s)</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }} className="cart-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item) => {
            const p = item.product;
            const pid = p._id || p;
            return (
              <div key={pid} className="card" style={{ padding: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
                <img src={p.images?.[0]} alt={p.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <Link to={`/product/${pid}`} style={{ fontWeight: 600 }}>{p.name}</Link>
                  <div className="text-sm text-muted">{p.category}</div>
                  <div style={{ fontWeight: 700, marginTop: 4 }}>₹{p.price.toLocaleString()}</div>
                </div>
                <QuantitySelector value={item.quantity} onChange={(q) => updateQty(pid, q)} max={p.stock || 99} />
                <div style={{ fontWeight: 700, minWidth: 90, textAlign: 'right' }}>₹{(p.price * item.quantity).toLocaleString()}</div>
                <button onClick={() => { remove(pid); toast.success('Removed'); }} style={{ color: 'var(--color-danger)', padding: 8 }}><FaTrash /></button>
              </div>
            );
          })}
          <button onClick={() => { clear(); toast.success('Cart cleared'); }} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>Clear Cart</button>
        </div>

        <div className="card" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 84 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Discount</span><span>-₹{discount}</span></div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
            <span>Total</span><span>₹{total.toLocaleString()}</span>
          </div>
          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 16 }} onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </button>
          <Link to="/shop" className="btn btn-ghost" style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}>Continue Shopping</Link>
        </div>
      </div>

      <style>{`@media(max-width:768px){.cart-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
};

export default Cart;
