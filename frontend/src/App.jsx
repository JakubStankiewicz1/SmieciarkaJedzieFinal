import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Collection from "./pages/Collection/Collection";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Orders from "./pages/Orders/Orders";
import AddProduct from "./pages/AddProduct/AddProduct";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import UserReservations from "./pages/UserReservations/UserReservations";

const App = () => {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Orders" element={<Orders />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/userReservations" element={<UserReservations  />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;