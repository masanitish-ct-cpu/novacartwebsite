import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    for (const k of ['fullName','phone','address','city','state','postalCode','country']) {
      if (!form[k]) { toast.error(`${k} is required`); return false; }
    }
    if (!/^\d{10}$/.test(form.phone)) { toast.error('Enter valid 10-digit phone'); return false; }
    if (!/^\d{6}$/.test(form.postalCode)) { toast.error('Enter valid 6-digit postal code'); return false; }
    if (items.length === 0) { toast.error('Cart is empty'); return false; }
    return true;
  };

  const handlePlace = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.product._id || i.product,
        name: i.product.name,
        image: i.product.images?.[0],
        price: i.product.price,
        quantity: i.quantity,
      }));
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: form,
        paymentMethod,
        subtotal,
        shippingPrice: shipping,
        discount: 0,
        totalPrice: total,
      });
      // save address to profile
      try {
        const existing = user?.addresses || [];
        const addr = { fullName: form.fullName, phone: form.phone, address: form.address, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country, isDefault: existing.length === 0 };
        const already = existing.some((a) => a.address === addr.address && a.city === addr.city && a.postalCode === addr.postalCode);
        if (!already) await updateProfile({ addresses: [...existing, addr] });
      } catch {}
      await clear();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${data.data._id}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page fade-in">
      <h1 className="section-title">Checkout</h1>
      <form onSubmit={handlePlace} style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }} className="checkout-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Shipping */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Shipping Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                ['fullName', 'Full Name', 'text'],
                ['phone', 'Phone', 'tel'],
                ['address', 'Address', 'text'],
                ['city', 'City', 'text'],
                ['state', 'State', 'text'],
                ['postalCode', 'Postal Code', 'text'],
                ['country', 'Country', 'text'],
              ].map(([name, label, type]) => (
                <div key={name} style={{ gridColumn: name === 'address' ? '1 / -1' : 'auto' }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
                  <input className="input" name={name} type={type} value={form[name]} onChange={handleChange} required />
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 18, marginBottom: 16 }}>Payment Method</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
              <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} /> Cash on Delivery
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="radio" checked={paymentMethod === 'Card'} onChange={() => setPaymentMethod('Card')} /> Card Payment (simulated)
            </label>
            {paymentMethod === 'Card' && (
              <div style={{ marginTop: 12, padding: 12, background: 'var(--color-bg)', borderRadius: 8, fontSize: 13, color: 'var(--color-muted)' }}>
                This is a simulated payment. No real charge will be made.
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="card" style={{ padding: 20, height: 'fit-content', position: 'sticky', top: 84 }}>
          <h3 style={{ fontSize: 18, marginBottom: 16 }}>Order Summary</h3>
          <div style={{ maxHeight: 240, overflowY: 'auto', marginBottom: 12 }}>
            {items.map((i) => (
              <div key={i.product._id || i.product} className="flex items-center justify-between" style={{ marginBottom: 8, fontSize: 14 }}>
                <span className="truncate" style={{ maxWidth: 200 }}>{i.product.name} × {i.quantity}</span>
                <span>₹{(i.product.price * i.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginBottom: 16 }}>
            <span>Total</span><span>₹{total.toLocaleString()}</span>
          </div>
          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>

      <style>{`@media(max-width:768px){.checkout-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
};

export default Checkout;
