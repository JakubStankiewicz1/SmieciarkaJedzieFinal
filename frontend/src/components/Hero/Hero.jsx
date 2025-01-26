import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import './hero.css';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';

const Hero = () => {

  const { navigate } = useContext(ShopContext);

  return (
    <div className="hero">


      {/* Hero Left Side */}
      <div className="hero-left">
        <img src={assets.hero} alt="Placeholder" className="hero-image" />
      </div>

      {/* Hero Right Side */}
      <div className="hero-right">

        <h1>Śmieciarka Jedzie - Tinder dla zbędnych przedmiotów</h1>
        <p>Masz przedmioty, których nie potrzebujesz i już z nich nie korzystasz?</p>

        <div className="buttonContainer">
            <button onClick={() => navigate("/add-product")} className="button1">Give Stuff</button>
            <button onClick={() => navigate("/collection")} className="button2">Find Stuff</button>
        </div>

      </div>


    </div>
  );
}

export default Hero;