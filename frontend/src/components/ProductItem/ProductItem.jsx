import React from 'react';
import './productItem.css';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, data, miasto, termin, zdjecie, tytul, opis }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const timeDiff = expiry - today;
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  const calculateDaysSince = (date) => {
    const today = new Date();
    const pastDate = new Date(date);
    const timeDiff = today - pastDate;
    const daysSince = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysSince;
  };

  // Funkcja do skracania opisu
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <Link to={`/product/${id}`} className="product-item">
      <img src={zdjecie} alt={tytul} className="product-image" />
      <div className="product-details">

        <div>
          <div className="header">
            <h3>{tytul}</h3>
            <p className="endDate">Termin ważności: <span className={`${calculateDaysSince(data) <= 3 ? "red" : ""}`}>
              {calculateDaysRemaining(termin)} dni
            </span></p>
          </div>

          {/* Wyświetlanie skróconego opisu */}
          <p className="description">{truncateDescription(opis, 60)}</p>
        </div>

        <div className="bottomDate">
          <p>{miasto} - {formatDate(data)}</p>
        </div>

      </div>
    </Link>
  );
};

export default ProductItem;
