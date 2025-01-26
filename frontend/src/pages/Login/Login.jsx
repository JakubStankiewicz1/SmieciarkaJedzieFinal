import React, { useState, useContext } from "react";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from "../../context/ShopContext";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const { login, register } = useContext(ShopContext);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*]/.test(password);
    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChars
    );
  };

  const validatePhone = (phone) => /^\+?[0-9]{7,}$/.test(phone);

  const validateName = (name) => /^[A-Za-ząćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(name) && name.length > 1;

  const validateNameLength = (name) => name.length >= 2 && name.length <= 50;

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "image_test");

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/dll2l3j8a/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from Cloudinary:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Image uploaded successfully:", data);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload profile picture");
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (currentState === "Login") {
      if (!validateEmail(email)) {
        toast.error("Invalid email format");
        return;
      }
      if (!validatePassword(password)) {
        toast.error(
          "Password must be at least 8 characters long and contain upper/lowercase letters, numbers, and special characters"
        );
        return;
      }
      await login(email, password);
    } else {
      if (!validateEmail(email)) {
        toast.error("Invalid email format");
        return;
      }
      if (!validatePassword(password)) {
        toast.error(
          "Password must be at least 8 characters long and contain upper/lowercase letters, numbers, and special characters"
        );
        return;
      }
      if (!validatePhone(phone)) {
        toast.error("Invalid phone number format");
        return;
      }
      if (!validateName(firstName) || !validateNameLength(firstName)) {
        toast.error("Invalid first name");
        return;
      }
      if (!validateName(lastName) || !validateNameLength(lastName)) {
        toast.error("Invalid last name");
        return;
      }

      let uploadedProfilePic = profilePic;

      if (profilePic instanceof File) {
        try {
          uploadedProfilePic = await handleImageUpload(profilePic);
        } catch (error) {
          return;
        }
      }

      const formData = {
        email,
        haslo: password,
        imie: firstName,
        nazwisko: lastName,
        telefon: phone,
        zdjecie_profilowe: uploadedProfilePic,
      };

      await register(formData);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <>
      <ToastContainer />

      <form className="login" onSubmit={handleSubmit}>
        <div className="stateChangeElement">
          <h3>{currentState}</h3>
        </div>

        {currentState === "Login" ? null : (
          <>
            <input
              type="text"
              placeholder="Imię"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Nazwisko"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Telefon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div className="profilePic">
              <p>Zdjęcie profilowe</p>
              <input
                type="file"
                onChange={handleProfilePicChange}
                required
              />
              {previewUrl && (
                <div className="imagePreview">
                  <img src={previewUrl} alt="Profile preview" className="imagePreviewImg" />
                </div>
              )}
            </div>
          </>
        )}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="bottomContainerPartElement">
          <div className="firstPartElement">
            <p className="forgotPassword">Forgot your password?</p>

            {currentState === "Login" ? (
              <p
                onClick={() => setCurrentState("Sign Up")}
                className="stateBtn"
              >
                Create account
              </p>
            ) : (
              <p onClick={() => setCurrentState("Login")} className="stateBtn">
                Login Here
              </p>
            )}
          </div>
        </div>

        <button className="submitTypeButton">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </>
  );
};

export default Login;
