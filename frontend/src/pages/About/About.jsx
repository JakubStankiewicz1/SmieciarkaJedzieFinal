import React from 'react';
import './about.css';
import { assets } from '../../assets/assets';

const About = () => {
  return (
    <div className="about">

      <hr />

      <div className="aboutPartOne">
        <div className="aboutOneText">
          <h1>About Us</h1>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.<br />Impedit, saepe earum deserunt explicabo doloremque nostrum distinctio modi, similique excepturi enim adipisci sequi corporis quo, totam quod!</p>
        </div>

        <div className="aboutOneImage">
          <img src={assets.about_1} alt="About Us" />
        </div>
      </div>

      <div className="aboutPartTwo">
        <div className="aboutTwoImage">
          <img src={assets.about_2} alt="Our Mission" />
        </div>

        <div className="aboutTwoText">
          <h1>Our Mission</h1>
          <p>Naszym celem jest nadanie drugiego życia niepotrzebnym rzeczom</p>
        </div>
      </div>

      <div className="aboutPartThree">
        <div className="aboutPartThreeImg1Ele">
          <img src={assets.about_9} alt="Best Customer Support" />
          <h3>Best Customer Support</h3>
          <p>We provide 24/7 customer support</p>
        </div>

        <div className="aboutPartThreeImg2Ele">
          <img src={assets.about_7} alt="Highest Quality Service" />
          <h3>Highest Quality Service</h3>
          <p>We provide highest quality service for our clients</p>
        </div>

        <div className="aboutPartThreeImg3Ele">
          <img src={assets.about_8} alt="Privacy Policy" />
          <h3>Privacy Policy</h3>
          <p>Due to our terms or privacy you can feel safe</p>
        </div>
      </div>

      <hr />

    </div>
  )
}

export default About;
