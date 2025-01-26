import "./footer.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="top">



        {/* Left Side */}
        <div className="leftSide">
          <img src={assets.logo} alt="Company Logo" />
          <div className="textContainer">

            
            <h4>Śmieciarka Jedzie – Razem dbamy o planetę!</h4>
            <p>
            Wierzymy, że każdy przedmiot zasługuje na drugie życie. Dzięki Tobie możemy budować społeczność, która dba o środowisko i pomaga innym.
            
            <br />

            Razem tworzymy lepszy świat! 🌍

            
            </p>
            <h5>Dziękujemy, że jesteś z nami.😊</h5>

          </div>
        </div>



        {/* Right Side */}
        <div className="rightSideFooter">

          <div className="company">
            <h2>COMPANY</h2>
            <ul className="listEl">
              <li>About Us</li>
              <li>Careers</li>
              <li>Press</li>
              <li>Blog</li>
            </ul>
          </div>



          <div className="footerContact">
            <h2>GET IN TOUCH</h2>
            <ul className="listEl">
              <NavLink to="/">Contact</NavLink>
              <NavLink to="/">Support</NavLink>
              <NavLink to="/">Privacy Policy</NavLink>
              <NavLink to="/">Terms of Service</NavLink>
            </ul>
          </div>

        </div>
      </div>

      <hr />
      <div className="bottom">
        <p>Copyright 2025 &copy; SmieciarkaJedzie.com - All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
