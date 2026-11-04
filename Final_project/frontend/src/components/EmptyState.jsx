const EmptyState = ({ title = 'Nothing here', message = '', icon }) => (
  <div className="empty-state fade-in">
    {icon && <div style={{ fontSize: 48, marginBottom: 8 }}>{icon}</div>}
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);
export default EmptyState;
