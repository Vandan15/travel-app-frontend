import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import "./layout.css";

export default function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
