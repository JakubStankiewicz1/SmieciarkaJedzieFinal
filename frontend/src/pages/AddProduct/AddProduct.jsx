import React, { useState, useEffect, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./addProduct.css";
import { ShopContext } from "../../context/ShopContext";
import { useNavigate } from "react-router-dom";
import { Cloudinary } from "cloudinary-core";

const AddProduct = () => {
  const { categories, cities, streets, fetchCategoriesCitiesAndStreets, addAnnouncement, setFilteredStreets } = useContext(ShopContext);
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchCategoriesCitiesAndStreets();
  }, [userId, navigate, fetchCategoriesCitiesAndStreets]);

  const [formData, setFormData] = useState({
    tytul: "",
    zdjecie: "",
    kategoria_id: "",
    opis: "",
    miasto_id: "",
    ulica_id: "",
    numer_domu: "",
    termin_waznosci: "",
    odebrane: false,
  });

  const [previewUrl, setPreviewUrl] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "zdjecie") {
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }

    if (name === "miasto_id") {
      const selectedCityId = parseInt(value);
      const filtered = streets.filter((street) => street.miasto_id === selectedCityId);
      setFilteredStreets(filtered);
    }
  };

  const validateFormData = () => {
    const { tytul, opis, numer_domu, termin_waznosci } = formData;

    // Walidacja tytułu
    if (tytul.length < 3 || tytul.length > 100) {
      toast.error("Tytuł musi mieć od 3 do 100 znaków.");
      return false;
    }
    const titleRegex = /^[A-Za-z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s.,!?-]+$/; // Dozwolone znaki
    if (!titleRegex.test(tytul)) {
      toast.error("Tytuł może zawierać tylko litery, cyfry oraz znaki: .,!?-");
      return false;
    }

    // Walidacja opisu
    if (opis.length < 10 || opis.length > 500) {
      toast.error("Opis musi mieć od 10 do 500 znaków.");
      return false;
    }

    // Walidacja numeru domu
    if (!/^\d+$/.test(numer_domu)) {
      toast.error("Numer domu musi składać się tylko z cyfr.");
      return false;
    }

    // Walidacja daty ważności
    const currentDate = new Date();
    const expirationDate = new Date(termin_waznosci);
    if (expirationDate <= currentDate) {
      toast.error("Data ważności musi być w przyszłości.");
      return false;
    }

    return true;
  };




  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'image_test');
  
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dll2l3j8a/image/upload`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response from Cloudinary:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Image uploaded successfully:', data);
      return data.secure_url; // Return the secure URL of the uploaded image
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const imageUrl = await handleImageUpload(formData.zdjecie);
    if (!imageUrl) {
      return; 
    }

    const success = await addAnnouncement({ ...formData, zdjecie: imageUrl });

    if (success) {
      toast.success("Produkt został dodany pomyślnie!");
      setFormData({
        tytul: "",
        zdjecie: "",
        kategoria_id: "",
        opis: "",
        miasto_id: "",
        ulica_id: "",
        numer_domu: "",
        termin_waznosci: "",
        odebrane: false,
      });
      setPreviewUrl("");
    } else {
      toast.error("Błąd podczas dodawania produktu.");
    }
  };

  return (
    <div className="addProduct">
      <div className="addProductLeftPart">
        <div className="titleContainer">
          <h4>Tytuł</h4>
          <input
            type="text"
            name="tytul"
            placeholder="Tytuł"
            value={formData.tytul}
            onChange={handleChange}
            required
          />
        </div>

        {/* Select for categories */}
        <div className="categoryFilter">
          <p>KATEGORIA</p>
          <select
            name="kategoria_id"
            value={formData.kategoria_id}
            onChange={handleChange}
          >
            <option value="">Wybierz kategorię</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nazwa}
              </option>
            ))}
          </select>
        </div>

        {/* Select for cities */}
        <div className="cityFilter">
          <p>MIASTO</p>
          <select
            name="miasto_id"
            value={formData.miasto_id}
            onChange={handleChange}
          >
            <option value="">Wybierz miasto</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.nazwa}
              </option>
            ))}
          </select>
        </div>

        {/* Select for streets */}
        <div className="streetFilter">
          <p>ULICA</p>
          <select
            name="ulica_id"
            value={formData.ulica_id}
            onChange={handleChange}
          >
            <option value="">Wybierz ulicę</option>
            {streets.filter(street => street.miasto_id === parseInt(formData.miasto_id)).map((street) => (
              <option key={street.id} value={street.id}>
                {street.nazwa}
              </option>
            ))}
          </select>
        </div>

        <div className="opis">
          <h4>Opis</h4>
          <textarea
            name="opis"
            placeholder="Opis"
            value={formData.opis}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="nrDomu">
          <h4>Numer domu</h4>
          <input
            type="text"
            name="numer_domu"
            placeholder="Numer domu"
            value={formData.numer_domu}
            onChange={handleChange}
            required
          />
        </div>

        <div className="dataWaznosci">
          <h4>Data ważności</h4>
          <input
            type="datetime-local"
            name="termin_waznosci"
            value={formData.termin_waznosci}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="addProductRightPart">



      <div className="linkDoZdj">
        <h4>Dodaj zdjęcie</h4>
        <input
          type="file"
          name="zdjecie"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setFormData({
                ...formData,
                zdjecie: file,
              });
              setPreviewUrl(URL.createObjectURL(file));
            }
          }}
          required
        />
        {previewUrl && (
          <div className="imagePreview">
            <img
              src={previewUrl}
              alt="Podgląd zdjęcia"
              className="previewImage"
              style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }}
            />
          </div>
        )}
      </div>






        <button type="submit" className="addProductBtn" onClick={handleSubmit}>
          Dodaj ogłoszenie
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AddProduct;