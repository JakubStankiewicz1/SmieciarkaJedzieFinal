import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./cart.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const [announcements, setAnnouncements] = useState([]);
    const { fetchUserAnnouncements, deleteAnnouncement, updateAnnouncementDate } = useContext(ShopContext); 
    const navigate = useNavigate();

    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchAnnouncements = async () => {
            const data = await fetchUserAnnouncements(userId);
            setAnnouncements(data);
        };

        fetchAnnouncements();
    }, [userId, navigate, fetchUserAnnouncements]);

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
            try {
                await deleteAnnouncement(id);
                toast.success("Ogłoszenie zostało usunięte.");
                setAnnouncements((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
                toast.error("Błąd podczas usuwania ogłoszenia.", error);
            }
        }
    };

    const trimDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + "...";
        }
        return description;
    };

    const handleUpdateDate = async (id, newDate) => {
        try {
            await updateAnnouncementDate(id, newDate);
            toast.success("Data wygaśnięcia została zaktualizowana.");
        } catch (error) {
            toast.error("Błąd podczas aktualizacji daty.", error);
        }
    };

    const calculateTimeRemaining = (expirationDate) => {
        const now = new Date();
        const expiration = new Date(expirationDate);
        const timeDiff = expiration - now;

        if (timeDiff <= 0) {
            return "Wygasło";
        }

        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        return `${days}d ${hours}h ${minutes}m`;
    };

    return (
        <div className="cart">
            <h2 className="cartHeaderTitle">Twoje ogłoszenia</h2>
            {announcements.length === 0 ? (
                <p>Brak ogłoszeń w koszyku.</p>
            ) : (
                <div className="cartListContinaer">
                    {announcements.map((item) => (
                        <div key={item.id} className="CartItem">
                            <div className="cart-item-details">
                                <div className="shopContainerElements">
                                    <div className="cartTopPart">
                                        <img src={item.zdjecie} alt={item.tytul} />
                                    </div>

                                    <div className="cartBottomPart">
                                        <h4 className="cartTitle">{item.tytul}</h4>
                                        <p className="cartDescription">
                                            {trimDescription(item.opis, 30)}
                                        </p>

                                        <div className="editDateContainer">
                                            <label htmlFor={`date-${item.id}`}>
                                                Zmień datę wygaśnięcia:
                                            </label>
                                            <input
                                                type="date"
                                                id={`date-${item.id}`}
                                                value={item.termin_waznosci.split("T")[0]}
                                                onChange={(e) =>
                                                    handleUpdateDate(item.id, e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="BinItemContainer">
                                <div className="timeRemaining">
                                    <p>Stan ogłoszenia</p>
                                    {calculateTimeRemaining(item.termin_waznosci)}
                                </div>
                                <img
                                    onClick={() => handleDelete(item.id)}
                                    src={assets.trash_bin}
                                    alt="Delete"
                                    className="binIcon"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <hr />

            <ToastContainer />
        </div>
    );
};

export default Cart;
