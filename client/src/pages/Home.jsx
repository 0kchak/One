// Imports
import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css";

// Page d'accueil
export default function Home() {
  return (
    <div className="screen">
      <div className="screendashBlue" />
      <div className="screendashPink" />
      <div className="screenWhite" />
      <div className="container">
        <div className="Lefthome side">
          <h2 className="texthome-center">Welcome to ONE</h2>
          <Link to="/login">
            <button className="button" type="submit">
              Log in
            </button>
          </Link>
          <hr className="line"></hr>
          <Link to="/register">
            <button className="button" type="submit">
              Register
            </button>
          </Link>
        </div>
        <div className="Right side" />
      </div>
    </div>
  );
}
