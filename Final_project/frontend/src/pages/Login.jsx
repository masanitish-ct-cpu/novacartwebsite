import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      const from = location.state?.from?.pathname || '/';
      navigate(from);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 420, margin: '0 auto' }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Welcome back</h1>
        <p className="text-muted" style={{ marginBottom: 20 }}>Login to your NovaCart account</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-lg" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p style={{ marginTop: 16, fontSize: 14, textAlign: 'center' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Register</Link>
        </p>
        <div style={{ marginTop: 16, padding: 12, background: 'var(--color-bg)', borderRadius: 8, fontSize: 12, color: 'var(--color-muted)' }}>
          Demo: user@novacart.com / User@123 · admin@novacart.com / Admin@123
        </div>
      </div>
    </div>
  );
};

export default Login;
