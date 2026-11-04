import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data.data)).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container page"><p>Loading...</p></div>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Products', value: stats.totalProducts, color: '#2563eb' },
    { label: 'Total Users', value: stats.totalUsers, color: '#10b981' },
    { label: 'Total Orders', value: stats.totalOrders, color: '#f59e0b' },
    { label: 'Total Revenue', value: `â‚¹${stats.totalRevenue.toLocaleString()}`, color: '#ef4444' },
  ];

  return (
    <div className="container page fade-in">
      <h1 className="section-title">Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {cards.map((c) => (
          <div key={c.label} className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="admin-grid">
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Low Stock Products</h3>
          {stats.lowStock?.length === 0 ? <p className="text-muted">All good.</p> : (
            <ul style={{ listStyle: 'none' }}>
              {stats.lowStock.map((p) => (
                <li key={p._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                  <span>{p.name}</span><span className="badge badge-danger">{p.stock} left</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Recent Orders</h3>
          {stats.recentOrders?.map((o) => (
            <div key={o._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)', fontSize: 14 }}>
              <span>#{o._id.slice(-6).toUpperCase()} — {o.user?.name}</span>
              <span>â‚¹{o.totalPrice.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
        <Link to="/admin/products" className="btn btn-primary">Manage Products</Link>
        <Link to="/admin/orders" className="btn btn-secondary">Manage Orders</Link>
        <Link to="/admin/users" className="btn btn-secondary">View Users</Link>
      </div>

      <style>{`@media(max-width:768px){.admin-grid{grid-template-columns:1fr !important}}`}</style>
    </div>
  );
};

export default AdminDashboard;
