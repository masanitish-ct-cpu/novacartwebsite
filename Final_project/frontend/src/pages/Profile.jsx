import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '' });

  useEffect(() => {
    if (tab === 'orders') {
      setLoadingOrders(true);
      api.get('/orders/my-orders').then(({ data }) => setOrders(data.data || [])).catch((e) => toast.error(e.message)).finally(() => setLoadingOrders(false));
    }
  }, [tab]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      toast.success('Profile updated');
      setForm({ ...form, password: '' });
    } catch (e) {
      toast.error(e.message);
    }
  };

  const statusColor = (s) => {
    const map = { Pending: 'badge-warning', Confirmed: 'badge', Processing: 'badge', Shipped: 'badge', Delivered: 'badge-success', Cancelled: 'badge-danger' };
    return map[s] || 'badge';
  };

  return (
    <div className="container page fade-in">
      <h1 className="section-title">My Account</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }} className="profile-layout">
        <aside className="card" style={{ padding: 12, height: 'fit-content' }}>
          {['profile','orders','addresses','wishlist'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, marginBottom: 4, background: tab === t ? 'var(--color-primary-light)' : 'transparent', color: tab === t ? 'var(--color-primary)' : 'var(--color-text)', fontWeight: tab === t ? 600 : 400, textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
          <button onClick={() => { logout(); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 8, color: 'var(--color-danger)' }}>Logout</button>
        </aside>

        <div>
          {tab === 'profile' && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Profile Information</h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                  <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
                  <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>New Password (optional)</label>
                  <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                </div>
                <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Order History</h2>
              {loadingOrders ? <p>Loading...</p> : orders.length === 0 ? (
                <p className="text-muted">No orders yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {orders.map((o) => (
                    <div key={o._id} className="card" style={{ padding: 16 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 8, flexWrap: 'wrap', gap: 8 }}>
                        <div>
                          <div style={{ fontWeight: 600 }}>Order #{o._id.slice(-8).toUpperCase()}</div>
                          <div className="text-sm text-muted">{new Date(o.createdAt).toLocaleString()}</div>
                        </div>
                        <span className={`badge ${statusColor(o.orderStatus)}`}>{o.orderStatus}</span>
                      </div>
                      <div className="text-sm text-muted" style={{ marginBottom: 8 }}>{o.orderItems.length} item(s) • ₹{o.totalPrice.toLocaleString()}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {o.orderItems.map((it, i) => (
                          <img key={i} src={it.image} alt={it.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Saved Addresses</h2>
              {user?.addresses?.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {user.addresses.map((a, i) => (
                    <div key={i} className="card" style={{ padding: 12 }}>
                      <strong>{a.fullName}</strong> • {a.phone}<br />
                      {a.address}, {a.city}, {a.state} - {a.postalCode}, {a.country}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No saved addresses. They'll be saved from checkout.</p>
              )}
            </div>
          )}

          {tab === 'wishlist' && (
            <div>
              <h2 style={{ fontSize: 18, marginBottom: 16 }}>Wishlist</h2>
              <Link to="/wishlist" className="btn btn-primary">Open Wishlist Page</Link>
            </div>
          )}
        </div>
      </div>

      <style>{`@media(max-width:768px){.profile-layout{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
};

export default Profile;
