// A supprimer
// Imports
import React from "react";
import { Link } from "react-router-dom";

/**
 * Fonction qui affiche la barre de navigation
 */
export default function BarreNavigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}
