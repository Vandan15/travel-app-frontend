import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../common/constant";
import "./common.css";

export default function AppLogo() {
  return (
    <Link to={ROUTES.MAIN} className="text-decoration-none">
      <h1 className="app-logo">Weekendmonks</h1>
    </Link>
  );
}
