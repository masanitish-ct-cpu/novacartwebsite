import { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data.data || [])).catch((e) => toast.error(e.message)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="container page fade-in">
      <h1 className="section-title">Users</h1>
      {loading ? <p>Loading...</p> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: 10 }}>Name</th><th style={{ padding: 10 }}>Email</th><th style={{ padding: 10 }}>Role</th><th style={{ padding: 10 }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: 10, fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: 10 }}>{u.email}</td>
                  <td style={{ padding: 10 }}><span className={`badge ${u.role === 'admin' ? 'badge-warning' : ''}`}>{u.role}</span></td>
                  <td style={{ padding: 10 }} className="text-sm text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
