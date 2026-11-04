import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value = 0, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (value >= i) stars.push(<FaStar key={i} className="star" />);
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="star" />);
    else stars.push(<FaRegStar key={i} className="star" style={{ color: '#d1d5db' }} />);
  }
  return (
    <span className="flex items-center gap-2" style={{ fontSize: 13 }}>
      <span className="flex">{stars}</span>
      {count !== undefined && <span className="text-muted">({count})</span>}
    </span>
  );
};

export default Rating;
