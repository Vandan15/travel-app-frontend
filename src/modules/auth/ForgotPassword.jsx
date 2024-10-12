import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { COOKIE_EXPIRY, ROUTES } from "../../common/constant";
import { deleteCookie, getCookie, setCookie } from "../../common/utils";
import AppLogo from "../../components/common/AppLogo";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const storedEmail = getCookie("timer");

    if (storedEmail) {
      setEmail(getCookie("email"));
      const currentTime = new Date().getTime();
      const timeRemaining = Math.max(
        0,
        Math.floor((parseInt(storedEmail) - currentTime) / 1000)
      );

      if (timeRemaining > 0) {
        setShowTimer(true);
        setTimeLeft(timeRemaining);
      } else {
        deleteCookie("timer");
        deleteCookie("email");
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (showTimer && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowTimer(false);
      deleteCookie("timer");
      deleteCookie("email");
    }
    return () => clearInterval(timer);
  }, [showTimer, timeLeft]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (isValid) {
      setShowTimer(true);
      setTimeLeft(COOKIE_EXPIRY * 60);
      const expiryTime = new Date().getTime() + COOKIE_EXPIRY * 60 * 1000; // Current
      setCookie("timer", expiryTime, COOKIE_EXPIRY);
      setCookie("email", email, COOKIE_EXPIRY);
    }
  };

  const handleClearEmail = () => {
    setEmail("");
    deleteCookie("timer");
    deleteCookie("email");
    setShowTimer(false);
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="mb-4">
          <AppLogo />
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!emailError}
              placeholder="Your email"
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={showTimer}
          >
            {showTimer ? `Resend in (${timeLeft}s)` : "Send Email"}
          </Button>
          {showTimer ? (
            <div className="text-center">
              Not your email?{" "}
              <Link onClick={handleClearEmail}>Try another</Link>
            </div>
          ) : (
            <div className="text-center">
              Remember your password? <Link to={ROUTES.LOGIN}>Login</Link>
            </div>
          )}
        </Form>
      </div>
    </Container>
  );
}
