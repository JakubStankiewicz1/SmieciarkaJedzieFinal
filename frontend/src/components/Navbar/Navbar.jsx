import React, { useContext, useEffect, useState } from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/ShopContext";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const { searchVisible, setSearchVisible } = useContext(ShopContext);


  const navigate = useNavigate();

  const location = useLocation();

  const userId = localStorage.getItem("user_id");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  useEffect(() => {
    // console.log(userId);
    console.log(location);
  });



  

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="logo" className="logo_image" />
      </Link>

      <ul className="list">
        <NavLink className="elementContainer" to="/">
          <p className="elementContainerP">HOME</p>
          <img src={assets.joint} className="underlineImage" />
        </NavLink>
        <NavLink className="elementContainer" to="/collection">
          <p className="elementContainerP">COLLECTION</p>
          <img src={assets.joint} className="underlineImage" />
        </NavLink>
        <NavLink className="elementContainer" to="/about">
          <p className="elementContainerP">ABOUT</p>
          <img src={assets.joint} className="underlineImage" />
        </NavLink>
        <NavLink className="elementContainer" to="/contact">
          <p className="elementContainerP">CONTACT</p>
          <img src={assets.joint} className="underlineImage" />
        </NavLink>
      </ul>

      <div className="rightPart">


        <div>
          <img src={assets.search} alt="" className="right_icon"  onClick={() => (location.pathname.includes("collection") ? setSearchVisible(true) : null)}  />
        </div>


        <div className="groupElement">
          {
            !userId ? <Link to="/login">
            <img src={assets.user} alt="" className="right_icon" />
          </Link> : <img src={assets.user} alt="" className="right_icon" />
          }
          {/* <Link to="/login">
            <img src={assets.user} alt="" className="right_icon" />
          </Link> */}
          <div className="dropdown">
            <div className="dropDownElement">
              <Link to="/userReservations">
                <p className="dropDownElementP">Your reservations</p>
              </Link>

              <p onClick={handleLogout}>Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className="cartElement">
          <img src={assets.wastebucket} alt="" className="right_icon"/>
        </Link>
        <Link to="/add-product">
          <img src={assets.plus} alt="" className="right_icon" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
