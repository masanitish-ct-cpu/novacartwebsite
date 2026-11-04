const Loader = ({ size = 36 }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
    <div className="spinner" style={{ width: size, height: size }} />
  </div>
);
export default Loader;
export const SkeletonCard = () => (
  <div className="card" style={{ padding: 12 }}>
    <div className="skeleton" style={{ height: 220, marginBottom: 12 }} />
    <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 12, width: '50%', marginBottom: 8 }} />
    <div className="skeleton" style={{ height: 16, width: '40%' }} />
  </div>
);
