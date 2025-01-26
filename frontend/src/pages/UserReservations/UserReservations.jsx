import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import "./userReservations.css";
import { ShopContext } from "../../context/ShopContext";

const ReservedProducts = () => {
  const {
    reservedProducts,
    errorMessage,
    loading,
    fetchReservedProducts,
    cancelReservation,
  } = useContext(ShopContext);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReservedProducts();
  }, [fetchReservedProducts]);

  if (loading) {
    return <div className="loadingMessage">Ładowanie...</div>;
  }

  if (errorMessage) {
    return <div className="errorMessage">{errorMessage}</div>;
  }

  if (reservedProducts.length === 0) {
    return <div className="noProductsMessage">Nie masz żadnych zarezerwowanych produktów.</div>;
  }

  return (
    <div className="reservedProducts">
      <h1>Zarezerwowane Produkty</h1>
      <div className="reservedProductList">
        {reservedProducts.map((product) => (
          <Link to={`/product/${product.id}`} key={product.id} className="productCard">
            <img src={product.zdjecie} alt={product.tytul} className="productImage" />
            <h2>{product.tytul}</h2>
            <div className="dateInfo">
              <p>Data dodania: {new Date(product.data_dodania).toLocaleDateString()}</p>
              <p>Termin ważności: {new Date(product.termin_waznosci).toLocaleDateString()}</p>
            </div>
            <button
              className="cancelButton"
              onClick={() => cancelReservation(product.id)}
            >
              Usuń rezerwację
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReservedProducts;
