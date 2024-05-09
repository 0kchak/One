// Imports
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Signin from "../components/login.js";
import { UserContext } from "../../context/userContext.jsx";
import oeil from "../assets/icones/oeil.png";

// Fonction Login
function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  // Objet contenant des strings pour chaque champ.
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    errorMsg: "",
  });

  /** Fonction qui permet de valider le formulaire.
   * Vérifie que tous les champs sont remplis selon les critères.
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    const fields = ["username", "password"];
    new Signin(formData, fields, navigate, setFormData, setUser);
  };

  /** Modifie la valeur d'un champ lors de la saisie.
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Rendu
  return (
    <div className="screen">
      <div className="screendashBlue" />
      <div className="screendashPink" />
      <div className="screenWhite"/>
      <div className="container">
        <div className="Left side">
          <h2 className="text-center">Log in</h2>
          <form className="signupForm" onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username" className="label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="input"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="BarrePwd">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="input"
                  value={formData.password}
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
            </div>
            <div className="errorcontainer">
              <span className="error-message">{formData.errorMsg}</span>
            </div>
            <button className="button" type="submit">
              Log in
            </button>
          </form>
          <Link className="link" to="/forget">
            Forgot your password?
          </Link>
          <hr></hr>
          <Link className="link" to="/register">
            Don't have an account? Sign up here!
          </Link>
        </div>
        <div className="Right side" />
      </div>
    </div>
  );
}

// Export
export default Login;
