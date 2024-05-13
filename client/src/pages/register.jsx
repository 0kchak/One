// Import
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/register.css";
import Signup from "../components/signup.js";
import oeil from "../assets/icones/oeil.png";


// Fonction d'inscription
function Register() {
  const navigate = useNavigate();

  // Un objet contenant des objets pour chaque champ.
  // Chaque champ possède une variable pour sa valeur et pour son message d'erreur.
  const [formData, setFormData] = useState({
    email: {
      value: "",
      errorMsg: "",
    },
    username: {
      value: "",
      errorMsg: "",
    },
    password: {
      value: "",
      errorMsg: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Fonction qui permet de valider le formulaire au click du bouton
   * correspondant.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    const fields = ["email", "username", "password"];
    new Signup(formData, fields, updateErrorMsg, navigate, setFormData);
  };

  /** Modifie la valeur d'un champ lors de la saisie.
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: {
        ...formData[id],
        value,
      },
    });
  };

  /* Modifie le message d'erreur, et donc le formulaire en entier.
   * Utilisé uniquement dans signup.js
   */
  const updateErrorMsg = (data) => {
    setFormData(data);
  };

  // Rendu
  return (
    <div className="screen">
      <div className="screendashBlue" />
      <div className="screendashPink" />
      <div className="screenWhite" />
      <div className="container">
        <div className="LeftReg side">
          <h2 className="textReg-center">Register</h2>
          <form className="signupForm" onSubmit={handleSubmit}>
            <div className="inputReg-group">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="inputReg"
                value={formData.email.value}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              <span className="errorReg-message">
                {formData.email.errorMsg}
              </span>
            </div>
            <div className="inputReg-group">
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="inputReg"
                value={formData.username.value}
                onChange={handleChange}
                placeholder="Enter your username"
              />
              <span className="errorReg-message">
                {formData.username.errorMsg}
              </span>
            </div>
            <div className="inputReg-group">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="BarrePwd">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="inputReg"
                  value={formData.password.value}
                  onChange={handleChange}
                  placeholder="Enter your password"
                />
                <div className="eye-container">
                  <img
                    className="eye"
                    src={oeil}
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>
              <span className="errorReg-message">
                {formData.password.errorMsg}
              </span>
            </div>
            <button className="button" type="submit">
              Register
            </button>
          </form>
          <Link className="link" to="/login">
            Already have an account? Log in here!
          </Link>
        </div>
        <div className="Right side" />
      </div>
    </div>
  );
}

// Export
export default Register;
