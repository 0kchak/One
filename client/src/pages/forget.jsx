// Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/forget.css";

// Fonction Login
function Forget() {
  const navigate = useNavigate();
  const [emailEntry, setEmailEntry] = useState({
    email: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /** Modifie la valeur d'un champ lors de la saisie.
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setEmailEntry({
      email: value,
    });
  };

  const handleforget = async () => {
    axios
      .post("/forgotpassword", { email: emailEntry.email })
      .then(({ data }) => {
        if (data.error) {
          setSuccessMsg("");
          setErrorMsg(data.error);
        } else {
          setErrorMsg("");
          setSuccessMsg(data.message);
        }
      });
  };

  // Rendu
  return (
    <div className="screen">
      <div className="screendashBlue" />
      <div className="screendashPink" />
      <div className="screenWhite" />
      <div className="container">
        <div className="Left forget side">
          <h2 className="text-center">Enter your email</h2>
          <div className="input-group">
            <p className="Forgetparagraph">
              Enter your email and we will send you a link to reset your
              password
            </p>
            <input
              type="text"
              id="email"
              className="input"
              value={emailEntry.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="errorcontainer">
            <span className="error-message">{errorMsg}</span>
            <span className="success-message">{successMsg}</span>
          </div>
          <button className="button forgetbutton" onClick={handleforget}>
            Send
          </button>
        </div>
        <div className="Right side" />
      </div>
    </div>
  );
}

// Export
export default Forget;
