import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  const { id } = useParams();
  return (
    <div className="container page" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
      <FaCheckCircle size={64} color="var(--color-success)" style={{ marginBottom: 16 }} />
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Order Placed!</h1>
      <p className="text-muted" style={{ marginBottom: 8 }}>Thank you for your purchase. Your order has been received.</p>
      <div className="card" style={{ padding: 16, margin: '24px 0' }}>
        <div className="text-sm text-muted">Order ID</div>
        <div style={{ fontWeight: 700, fontSize: 16, wordBreak: 'break-all' }}>{id}</div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link to="/profile" className="btn btn-primary">View Orders</Link>
        <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
