import React, { useContext } from "react";
import { ShopContext } from "../../context/ShopContext";
import ProductItem from "../ProductItem/ProductItem";
import Title from "../Title/Title";
import "./latestProducts.css";

const LatestProducts = () => {
  const { ogloszenia } = useContext(ShopContext);

  // Pobierz bieżącą datę
  const currentDate = new Date();

  // Filtruj ogłoszenia według terminu ważności
  const validOgloszenia = ogloszenia
    .filter((ogloszenie) => new Date(ogloszenie.termin_waznosci) > currentDate) // Sprawdzenie, czy termin jest przyszłością
    .slice(-5); // Pobranie ostatnich 5 ważnych ogłoszeń

  return (
    <div>
      <div className="ogloszenia-section">
        <Title text1={"NAJNOWSZE"} text2={"OGŁOSZENIA"} />

        {/* Wyświetlanie ważnych ogłoszeń */}
        {validOgloszenia.map((ogloszenie, index) => (
          <ProductItem
            key={index}
            id={ogloszenie.id}
            data={ogloszenie.data_dodania}
            miasto={ogloszenie.miasto_id}
            termin={ogloszenie.termin_waznosci}
            zdjecie={ogloszenie.zdjecie}
            tytul={ogloszenie.tytul}
            opis={ogloszenie.opis}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
