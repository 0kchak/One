// Imports
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import eye from "../assets/icones/oeil.png";
import axios from "axios";
import { useParams } from "react-router-dom";

// Fonction Login
function Reset() {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [resetStatus, setResetStatus] = useState("");
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errorMsg, setErrorMsg] = useState({
    password: "",
    confirmPassword: "",
  });

  const [successMsg, setSuccessMsg] = useState("");

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    axios.post("/verifytoken", { token: token }).then(({ data }) => {
      if (data.errorexpire) {
        setResetStatus("expired");
      } else if (data.error) {
        navigate("/login");
      } else {
        setResetStatus("valid");
        setEmail(data.email);
      }
    });
  }, [token]);

  const validtoken = () => {
    const handleChange = (e) => {
      const { id, value } = e.target;
      setNewPassword({
        ...newPassword,
        [id]: value,
      });
    };

    const togglePasswordVisibility = (field) => {
      setShowPassword({
        ...showPassword,
        [field]: !showPassword[field],
      });
    };

    const updateErrormsg = (field, msg) => {
      setErrorMsg((prevErrorMsg) => ({
        ...prevErrorMsg,
        [field]: msg,
      }));
    };

    const verifpassword = () => {
      const majusculeRegex = /[A-Z]/;
      const chiffreRegex = /\d/;
      const specialRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (newPassword.password.length < 8) {
        updateErrormsg("password", `Password must be at least 8 characters`);
        return false;
      } else {
        // Vérifie que le mot de passe possède au moins une majuscule
        if (!majusculeRegex.test(newPassword.password)) {
          updateErrormsg(
            "password",
            `Password must have at least an upper case`
          );
          return false;
        }
        // Vérifie que le mot de passe possède au moins un chiffre
        else if (!chiffreRegex.test(newPassword.password)) {
          updateErrormsg("password", `Password must have at least a number`);
          return false;
        }
        // Vérifie que le mot de passe possède au moins au caractère spécial
        else if (!specialRegex.test(newPassword.password)) {
          updateErrormsg(
            "password",
            `Password must have at least a special character`
          );
          return false;
        }
        // Si toutes les conditions sont validées
        updateErrormsg("password", "");
        return true;
      }
    };

    const samepassword = () => {
      if (newPassword.password === newPassword.confirmPassword) {
        updateErrormsg("confirmPassword", "");
        return true;
      } else {
        updateErrormsg("confirmPassword", `Passwords do not match`);
      }
    };

    const handleReset = () => {
      if (verifpassword() && samepassword()) {
        //coté back
        axios
          .post("/reset", { email: email, newPassword: newPassword.password })
          .then(({ data }) => {
            if (!data) {
              setSuccessMsg("Password updated successfully. Return to log-in");
            } else {
              setErrorMsg(data.error);
            }
          });
      }
    };

    // Rendu
    return (
      <div className="screen">
        <div className="screendashBlue" />
        <div className="screendashPink" />
        <div className="screenWhite" />
        <div className="container">
          <div className="Left side">
            <h2 className="text-center">Reset your password</h2>
            <div className="input-group">
              <label htmlFor="password" className="label">
                New Password
              </label>
              <div className="BarrePwd">
                <input
                  type={showPassword.password ? "text" : "password"}
                  id="password"
                  className="input"
                  value={newPassword.password}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                />
                <div className="eye-container">
                  <img
                    className="eye"
                    src={eye}
                    onClick={() => togglePasswordVisibility("password")}
                  />
                </div>
              </div>
              <div className="errorcontainer">
                <span className="error-message">{errorMsg.password}</span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password" className="label">
                Confirm Password
              </label>
              <div className="BarrePwd">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="input"
                  value={newPassword.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
                <div className="eye-container">
                  <img
                    className="eye"
                    src={eye}
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                  />
                </div>
              </div>
            </div>
            <div className="errorcontainer">
              <span className="error-message">{errorMsg.confirmPassword}</span>
              <span className="success-message">{successMsg}</span>
            </div>
            <button className="button" onClick={() => handleReset()}>
              Reset
            </button>
          </div>
          <div className="Right side" />
        </div>
      </div>
    );
  };

  const style = {
    margin: "14.3rem 0",
  };
  if (resetStatus === "expired") {
    return (
      <div className="screen">
        <div className="container">
          <div className="Left side">
            <h2 className="text-center expired" style={style}>
              Link Expired
            </h2>
          </div>
          <div className="Right side" />
        </div>
      </div>
    );
  }
  if (resetStatus === "valid") {
    return validtoken();
  }
}
// Export
export default Reset;
