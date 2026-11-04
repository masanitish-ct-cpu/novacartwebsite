const ErrorMessage = ({ message }) => (
  <div className="empty-state">
    <div style={{ fontSize: 40 }}>⚠️</div>
    <h3>Something went wrong</h3>
    <p>{message}</p>
  </div>
);
export default ErrorMessage;
