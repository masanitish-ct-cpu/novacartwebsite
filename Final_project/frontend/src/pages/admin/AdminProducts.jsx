import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const empty = { name: '', description: '', category: 'Electronics', brand: '', price: '', originalPrice: '', discount: '', stock: '', images: '', featured: false, isNewArrival: false };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.data || []);
    } catch (e) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(empty); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name, description: p.description, category: p.category, brand: p.brand,
      price: p.price, originalPrice: p.originalPrice, discount: p.discount, stock: p.stock,
      images: (p.images || []).join(', '), featured: p.featured, isNewArrival: p.isNewArrival,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      originalPrice: Number(form.originalPrice),
      discount: Number(form.discount || 0),
      stock: Number(form.stock),
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editing) await api.put(`/products/${editing}`, payload);
      else await api.post('/products', payload);
      toast.success(editing ? 'Product updated' : 'Product created');
      setShowForm(false);
      load();
    } catch (e) { toast.error(e.message); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Deleted');
      load();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="container page fade-in">
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <h1 className="section-title" style={{ margin: 0 }}>Products</h1>
        <button className="btn btn-primary" onClick={openNew}>+ Add Product</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, marginBottom: 12 }}>{editing ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ gridColumn: '1 / -1' }} />
            <textarea className="input" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required style={{ gridColumn: '1 / -1' }} rows={3} />
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['Electronics','Fashion','Footwear','Accessories','Home & Living','Beauty','Sports'].map(c => <option key={c}>{c}</option>)}
            </select>
            <input className="input" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            <input className="input" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="input" placeholder="Original Price" type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} required />
            <input className="input" placeholder="Discount %" type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} />
            <input className="input" placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            <input className="input" placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} style={{ gridColumn: '1 / -1' }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} /> New Arrival</label>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p>Loading...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: 10 }}>Image</th><th style={{ padding: 10 }}>Name</th><th style={{ padding: 10 }}>Category</th><th style={{ padding: 10 }}>Price</th><th style={{ padding: 10 }}>Stock</th><th style={{ padding: 10 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 10 }}><img src={p.images?.[0]} alt="" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6 }} /></td>
                  <td style={{ padding: 10, fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: 10 }}>{p.category}</td>
                  <td style={{ padding: 10 }}>â‚¹{p.price.toLocaleString()}</td>
                  <td style={{ padding: 10 }}>{p.stock}</td>
                  <td style={{ padding: 10 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)} style={{ marginRight: 6 }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
