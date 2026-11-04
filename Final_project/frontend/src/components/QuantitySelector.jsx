import { FaMinus, FaPlus } from 'react-icons/fa';

const QuantitySelector = ({ value, onChange, max = 99, min = 1 }) => (
  <div className="flex items-center" style={{ border: '1px solid var(--color-border)', borderRadius: 8, overflow: 'hidden' }}>
    <button onClick={() => onChange(Math.max(min, value - 1))} style={{ padding: '6px 10px' }}><FaMinus size={10} /></button>
    <span style={{ padding: '6px 14px', fontWeight: 600, minWidth: 32, textAlign: 'center' }}>{value}</span>
    <button onClick={() => onChange(Math.min(max, value + 1))} style={{ padding: '6px 10px' }}><FaPlus size={10} /></button>
  </div>
);
export default QuantitySelector;
