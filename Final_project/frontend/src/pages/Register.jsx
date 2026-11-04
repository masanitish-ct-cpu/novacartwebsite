import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 460, margin: '0 auto' }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Create account</h1>
        <p className="text-muted" style={{ marginBottom: 20 }}>Join NovaCart today</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Password</label>
            <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Confirm Password</label>
            <input className="input" type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
          </div>
          <button className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
