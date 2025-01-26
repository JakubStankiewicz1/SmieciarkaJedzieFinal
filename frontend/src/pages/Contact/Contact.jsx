import React from 'react';
import './contact.css';
import { assets } from '../../assets/assets';
import { ToastContainer, toast } from 'react-toastify';

const Contact = () => {

  const onSubmit = async (event) => {
    event.preventDefault();
    toast.info("Sending....");

    const formData = new FormData(event.target);

    // Pobieranie wartości z formularza
    const name = formData.get("name");
    const surname = formData.get("surname");
    const email = formData.get("email");
    const message = formData.get("message");

    // Skonstruowanie wiadomości
    const formattedMessage = `
      Imię: ${name}
      Nazwisko: ${surname}
      Email: ${email}
      
      Wiadomość:
      ${message}
    `;

    // Dodanie danych do formData
    formData.append("access_key", "e2ac1a11-bdf9-48b8-a7ce-9d92f185f03a");
    formData.append("message", formattedMessage);

    // Wysłanie formularza do Web3Forms
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      toast.success("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      toast.error(data.message);
    }
  };

  return (
    <div className="contact">

      <div className="contactPathOneContainer">

        <div className="contactPartOneLeftPart">
          <img src={assets.about_6} alt="" />
        </div>

        <div className="contactPartOneRightPart">
          <div className="contactPartOneRightPartTopPart">
            <h3>Get in touch with us</h3>
          </div>

          <div className="contactPartOneRightPartBottomPart">
            <div className="contactLocationPart">
              <img src={assets.location_img} alt="" className="contactSmallIcon" />
              <div className="contactLocationPartContactContainer">
                <h4>Location</h4>
                <p>1234 Street Name, City Name, United States</p>
              </div>
            </div>

            <div className="contactPhonePart">
              <img src={assets.phone} alt="" className="contactSmallIcon" />
              <div className="contactPhonePartContactContainer">
                <h4>Phone</h4>
                <p>+123 456 7890</p>
              </div>
            </div>

            <div className="emailEmailPart">
              <img src={assets.email} alt="" className="contactSmallIcon" />
              <div className="emailEmailPartContactContainer">
                <h4>Email</h4>
                <p>smieciarka.jedzie.contact@gmail.com</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="contactPartTwoContainer">
        <div className="contactPartTwoContainerLeftPart">
          <h3>Message Us</h3>
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique cupiditate, et mollitia voluptatem id aspernatur consectetur! Quis, voluptatum. Aspernatur nesciunt optio officiis? Libero facere optio corporis distinctio voluptatum exercitationem ratione!</p>
          <img src={assets.snowman} alt="" className="contactLogo" />
        </div>

        <div className="contactPartTwoContainerRightPart">

          <form onSubmit={onSubmit}>
            <div className="contactFormTop">
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="text" name="surname" placeholder="Your Surname" required />
            </div>
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>

      </div>

      <ToastContainer />
    </div>
  );
}

export default Contact;
