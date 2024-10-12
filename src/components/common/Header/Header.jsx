import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { AppContext } from "../../../AppContext";
import { ROUTES } from "../../../common/constant";
import { getInitials } from "../../../common/utils";
import CommonButton from "../../primitives/CommonButton";
import AppLogo from "../AppLogo";
import "./header.css";

const Header = () => {
  const [open, setOpen] = useState(false);
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const toggleMenu = () => {
    setOpen(!open);
  };

  useEffect(() => {
    window.addEventListener("scroll", isSticky);
    return () => {
      window.removeEventListener("scroll", isSticky);
    };
  });

  // sticky Header
  const isSticky = (e) => {
    const header = document.querySelector(".header-section");
    const scrollTop = window.scrollY;
    scrollTop >= 120
      ? header.classList.add("is-sticky")
      : header.classList.remove("is-sticky");
  };

  const AuthSection = () => {
    if (!currentUser?.name) {
      return (
        <div className="d-flex gap-2">
          <Link to={ROUTES.LOGIN}>
            <CommonButton variant="secondary">Login</CommonButton>
          </Link>
          <Link to={ROUTES.REGISTER}>
            <CommonButton variant="secondary">Register</CommonButton>
          </Link>
        </div>
      );
    }
    return (
      <div className="d-flex gap-2 align-items-center">
        <Link to={ROUTES.PROFILE} className="text-decoration-none">
          <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white user-initials">
            {getInitials(currentUser?.name)}
          </div>
        </Link>
      </div>
    );
  };
  return (
    <header className="header-section">
      <Container>
        <Navbar expand="lg" className="p-0">
          {/* Logo Section  */}
          <Navbar.Brand>
            <NavLink to="/"> Weekendmonks</NavLink>
          </Navbar.Brand>
          {/* End Logo Section  */}

          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="start"
            show={open}
          >
            {/*mobile Logo Section  */}
            <Offcanvas.Header>
              <AppLogo />
              <span className="navbar-toggler ms-auto" onClick={toggleMenu}>
                <i className="bi bi-x-lg"></i>
              </span>
            </Offcanvas.Header>
            {/*end mobile Logo Section  */}

            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <NavLink className="nav-link" to="/#home">
                  Home
                </NavLink>
                <NavLink className="nav-link" to="/#about">
                  ABOUT US
                </NavLink>
                <NavLink className="nav-link" to="/#tours">
                  TOURS
                </NavLink>

                <NavDropdown
                  title="DESTINATION"
                  id={`offcanvasNavbarDropdown-expand-lg`}
                >
                  <NavLink className="nav-link text-dark" to="/#destination">
                    SPAIN TOURS
                  </NavLink>
                </NavDropdown>
                <NavLink className="nav-link" to="/#gallery">
                  GALLERY
                </NavLink>
                <NavLink className="nav-link" to="/#contact">
                  CONTACT
                </NavLink>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
          <div className="d-flex align-items-center">
            <AuthSection />
            <li className="d-inline-block d-lg-none ms-3 toggle_btn">
              <i
                className={open ? "bi bi-x-lg" : "bi bi-list"}
                onClick={toggleMenu}
              ></i>
            </li>
          </div>
        </Navbar>
      </Container>
    </header>
  );
};

export default Header;
