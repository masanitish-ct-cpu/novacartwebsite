import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const statuses = ['Pending','Confirmed','Processing','Shipped','Delivered','Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data.data || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success('Status updated');
      load();
      if (selected?._id === id) setSelected({ ...selected, orderStatus: status });
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="container page fade-in">
      <h1 className="section-title">Orders</h1>
      {loading ? <p>Loading...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: 10 }}>Order</th><th style={{ padding: 10 }}>Customer</th><th style={{ padding: 10 }}>Items</th><th style={{ padding: 10 }}>Total</th><th style={{ padding: 10 }}>Status</th><th style={{ padding: 10 }}>Date</th><th style={{ padding: 10 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 10, fontWeight: 500 }}>#{o._id.slice(-6).toUpperCase()}</td>
                  <td style={{ padding: 10 }}>{o.user?.name}<br /><span className="text-sm text-muted">{o.user?.email}</span></td>
                  <td style={{ padding: 10 }}>{o.orderItems.length}</td>
                  <td style={{ padding: 10 }}>â‚¹{o.totalPrice.toLocaleString()}</td>
                  <td style={{ padding: 10 }}>
                    <select value={o.orderStatus} onChange={(e) => updateStatus(o._id, e.target.value)} className="input" style={{ width: 140, padding: 6 }}>
                      {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: 10 }} className="text-sm text-muted">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: 10 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => setSelected(o)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelected(null)}>
          <div className="card" style={{ padding: 24, maxWidth: 600, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, marginBottom: 12 }}>Order #{selected._id.slice(-6).toUpperCase()}</h2>
            <div className="text-sm text-muted" style={{ marginBottom: 12 }}>{selected.shippingAddress?.fullName} â€¢ {selected.shippingAddress?.phone}</div>
            <div className="text-sm" style={{ marginBottom: 12 }}>{selected.shippingAddress?.address}, {selected.shippingAddress?.city}, {selected.shippingAddress?.state} - {selected.shippingAddress?.postalCode}</div>
            {selected.orderItems.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <img src={it.image} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ flex: 1 }}>{it.name} Ã— {it.quantity}</div>
                <div>â‚¹{(it.price * it.quantity).toLocaleString()}</div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: 12, paddingTop: 12, fontWeight: 700 }}>Total: â‚¹{selected.totalPrice.toLocaleString()}</div>
            <button className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
