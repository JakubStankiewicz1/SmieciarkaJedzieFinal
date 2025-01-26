import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import "./product.css";
import { assets } from "../../assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { currentProduct, fetchProductById, reserveProduct } = useContext(ShopContext);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Funkcja do formatowania daty (miesiąc i rok)
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Pobieranie produktu na podstawie jego ID
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        await fetchProductById(productId);
      };
      fetchProduct();
    }
  }, [productId, fetchProductById]);

  // Przełączanie pełnoekranowego widoku
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Funkcja obsługująca rezerwację produktu
  const handleReserve = async () => {
    const result = await reserveProduct(productId);
    if (result && result.error) {
      setErrorMessage(result.error);
    } else {
      setErrorMessage("");
    }
  };

  if (!currentProduct) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product">
      <div className="leftPart">
        <div className="imageContainer">
          <div
            className={`imageElement ${isFullscreen ? "fullscreen" : ""}`}
            onClick={toggleFullscreen}
          >
            <img
              src={currentProduct.zdjecie}
              alt={currentProduct.tytul}
              onError={() => console.error(`Image not loading: ${currentProduct.zdjecie}`)}
            />
          </div>
          <div className="bottomContainerPart" onClick={toggleFullscreen}>
            <img src={assets.fullscreen} alt="Fullscreen" />
          </div>
        </div>
        <div className="descriptionContainer">
          <h4 className="descElement">OPIS</h4>
          <p>{currentProduct.opis}</p>
          <div className="idInfo">
            <hr />
            <div className="idInfoText">
              <p>ID: {currentProduct.id}</p>
              <p
                style={{
                  cursor: "pointer",
                  color: "#007bff",
                  textDecoration: "underline",
                }}
              >
                Zgłoś
              </p>
            </div>
          </div>
        </div>
        <div className="contactContainer"></div>
      </div>
      <div className="rightPartInfo">
        <div className="productInfo">
          <div className="partOne">
            <p className="dataDodania">Dodane: {formatDate(currentProduct.data_dodania)}</p>
            <h1 className="prodctTitle">{currentProduct.tytul}</h1>
            <div className="contactSection">
              <button>Wyślij wiadomość</button>
              <button className="callMe">Zadzwoń</button>
            </div>
            <p className="expDate">Wygasa: {formatDate(currentProduct.termin_waznosci)}</p>
          </div>
        </div>
        <div className="authorDetailsContainer">
          <div className="authorDetails">
            <img
              src={currentProduct.autor_zdjecie}
              alt={`${currentProduct.autor_imie} ${currentProduct.autor_nazwisko}`}
              onError={() => console.error(`Image not loading: ${currentProduct.autor_zdjecie}`)}
            />
            <div className="authorInfo">
              <p className="authorName">
                {currentProduct.autor_imie} <br />
                <span className="authorNameSurnameEle">{currentProduct.autor_nazwisko}</span>
              </p>
              <p className="authorSince">
                Na SmieciarkaJedzie od:{" "}
                {currentProduct.autor_data_rejestracji && formatDate(currentProduct.autor_data_rejestracji)}
              </p>
            </div>
          </div>
        </div>

        <div className="localizationContainer">
          <div className="locationLeftPart">
            <h3 className="locationText">Lokalizacja</h3>
            <p className="cityName">{currentProduct.miasto_nazwa}</p>
            <div className="houseAddress">
              <p>{currentProduct.ulica_nazwa} {currentProduct.numer_domu}</p>
            </div>
          </div>

          <div className="locationRightPart">
            <a
              href={`https://www.google.pl/maps/place/${currentProduct.ulica_nazwa}+${currentProduct.numer_domu},${currentProduct.miasto_nazwa}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={assets.location} alt="location" />
            </a>
          </div>
        </div>

        <div className="reservationContainer">
          {currentProduct.zarezerwowane ? (
            <p className="reservationInfo">Ten produkt został już zarezerwowany.</p>
          ) : (
            <button
              className="reserveButton"
              onClick={handleReserve}
            >
              ZAREZERWUJ TERAZ
            </button>
          )}
          {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Product;