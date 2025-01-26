import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const [ogloszenia, setOgloszenia] = useState([]);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [streets, setStreets] = useState([]);
    const [filteredStreets, setFilteredStreets] = useState([]);
    const [reservedProducts, setReservedProducts] = useState([]);
    const [isReserved, setIsReserved] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchVisible, setSearchVisible] = useState(false);

    const navigate = useNavigate();

    // Pobieranie wszystkich ogłoszeń
    useEffect(() => {
        const fetchOgloszenia = async () => {
            try {
                const response = await fetch('http://localhost:5001/ogloszenie');
                const data = await response.json();
                setOgloszenia(data);
            } catch (error) {
                console.error('Błąd przy pobieraniu ogłoszeń:', error);
            }
        };

        fetchOgloszenia();
    }, []);

    // Pobieranie kategorii, miast i ulic
    const fetchCategoriesCitiesAndStreets = async () => {
        try {
            const categoriesResponse = await fetch("http://localhost:5001/kategoria");
            const citiesResponse = await fetch("http://localhost:5001/miasto");
            const streetsResponse = await fetch("http://localhost:5001/ulica");

            const categoriesData = await categoriesResponse.json();
            const citiesData = await citiesResponse.json();
            const streetsData = await streetsResponse.json();

            setCategories(categoriesData);
            setCities(citiesData);
            setStreets(streetsData);
        } catch (error) {
            console.log("Błąd przy pobieraniu kategorii, miast lub ulic:", error);
        }
    };


    // Rezerwacja produktów
    const reserveProduct = async (productId) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            setErrorMessage("Musisz być zalogowany, aby zarezerwować produkt.");
            return;
        }

        // Sprawdzamy, czy użytkownik próbuje zarezerwować swój własny produkt
        if (currentProduct.uzytkownik_id === parseInt(userId)) {
            setErrorMessage("Nie możesz zarezerwować własnego produktu.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/ogloszenie/${productId}/rezerwacja`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uzytkownik_id: userId }),
            });

            if (response.ok) {
                setCurrentProduct((prev) => ({ ...prev, zarezerwowane: true }));
                setErrorMessage("");
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Rezerwacja nie powiodła się.");
            }
        } catch (error) {
            setErrorMessage("Wystąpił błąd podczas rezerwacji.");
        }
    };


    

    // Pobieranie zarezerwowanych produktów
    const fetchReservedProducts = async () => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/ogloszenia/rezerwacje/${userId}`);
            if (response.ok) {
                const products = await response.json();
                setReservedProducts(products);
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Nie udało się pobrać zarezerwowanych produktów.");
            }
        } catch (error) {
            setErrorMessage("Wystąpił błąd podczas pobierania zarezerwowanych produktów.");
        } finally {
            setLoading(false);
        }
    };

    // Funkcja usuwania rezerwacji
    const cancelReservation = async (productId) => {
        const userId = localStorage.getItem("user_id");

        try {
            const response = await fetch(`http://localhost:5001/ogloszenie/${productId}/usun_rezerwacje`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ uzytkownik_id: userId }),
            });

            if (response.ok) {
                setReservedProducts((prevProducts) =>
                    prevProducts.filter((product) => product.id !== productId)
                );
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Nie udało się usunąć rezerwacji.");
            }
        } catch (error) {
            setErrorMessage("Wystąpił błąd podczas usuwania rezerwacji.");
        }
    };

    // Dodawanie ogłoszenia
    const addAnnouncement = async (formData) => {
        try {
            const userId = localStorage.getItem("user_id");
            const updatedFormData = {
                ...formData,
                uzytkownik_id: userId,
            };

            const response = await fetch("http://localhost:5001/ogloszenie", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                return true;
            } else {
                console.error("Błąd podczas dodawania ogłoszenia.");
                return false;
            }
        } catch (error) {
            console.error("Błąd przy dodawaniu ogłoszenia:", error);
            return false;
        }
    };

    

    // Pobieranie pojedynczego ogłoszenia na podstawie id
    const fetchProductById = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/ogloszenie/${id}`);
            const data = await response.json();
            setCurrentProduct(data);
        } catch (error) {
            console.error('Błąd przy pobieraniu produktu:', error);
        }
    };

    // Pobieranie ogłoszeń użytkownika na podstawie userId
    const fetchUserAnnouncements = async (userId) => {
        try {
            const response = await fetch(
                `http://localhost:5001/ogloszenie/user/${userId}`
            );
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error("Błąd podczas pobierania ogłoszeń.");
                return [];
            }
        } catch (error) {
            console.error("Błąd przy pobieraniu ogłoszeń użytkownika:", error);
            return [];
        }
    };

    // Usuwanie ogłoszenia
    const deleteAnnouncement = async (id) => {
        try {
            const response = await fetch(`http://localhost:5001/ogloszenie/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setOgloszenia((prev) => prev.filter((item) => item.id !== id));
            } else {
                console.error("Błąd podczas usuwania ogłoszenia.");
            }
        } catch (error) {
            console.error("Błąd przy usuwaniu ogłoszenia:", error);
        }
    };

    // Aktualizacja daty wygaśnięcia ogłoszenia
    const updateAnnouncementDate = async (id, newDate) => {
        try {
            const response = await fetch(
                `http://localhost:5001/ogloszenie/${id}/update_date`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ termin_waznosci: newDate }),
                }
            );

            if (response.ok) {
                setOgloszenia((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, termin_waznosci: newDate } : item
                    )
                );
            } else {
                console.error("Błąd podczas aktualizacji daty.");
            }
        } catch (error) {
            console.error("Błąd przy aktualizacji daty ogłoszenia:", error);
        }
    };

    // Funkcja logowania
    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, haslo: password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }
    
            const data = await response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user_id);
            toast("Login successful! Redirecting to home...", { type: "success" });
    
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            toast(error.message, { type: "error" });
        }
    };
    
    const register = async (formData) => {
        try {
            const response = await fetch("http://localhost:5001/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }
    
            toast("Registration successful! You can now log in.", { type: "success" });
        } catch (error) {
            toast(error.message, { type: "error" });
        }
    };
    
    const value = {
        ogloszenia,
        currentProduct,
        categories,
        cities,
        streets,
        filteredStreets,
        reservedProducts,
        errorMessage,
        loading,
        searchVisible,
        setSearchVisible,
        fetchCategoriesCitiesAndStreets,
        fetchProductById,
        fetchUserAnnouncements,
        addAnnouncement,
        deleteAnnouncement,
        updateAnnouncementDate,
        login,
        register,
        fetchReservedProducts,
        cancelReservation,
        navigate,
        setFilteredStreets,
        reserveProduct
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;