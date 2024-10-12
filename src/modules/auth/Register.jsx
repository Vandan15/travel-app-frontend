import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Alert, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ROUTES } from "../../common/constant";
import AppLogo from "../../components/common/AppLogo";
import CommonButton from "../../components/primitives/CommonButton";
import { EMAIL_SIGNUP } from "./graphql/mutations";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [success, setSuccess] = useState(false);

  const [registerMutate, { loading }] = useMutation(EMAIL_SIGNUP, {
    onError: () => {},
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return re.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    setSuccess(false);

    if (!name) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long and contain at least one uppercase letter and one special character"
      );
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Confirm Password is required");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (isValid) {
      registerMutate({
        variables: {
          data: {
            name,
            email,
            password,
          },
        },
        onCompleted: () => {
          setSuccess(true);
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        },
      });
    }
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
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Group controlId="name" className="mb-4">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!nameError}
            />
            <Form.Control.Feedback type="invalid">
              {nameError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="email" className="mb-4">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              value={email}
              placeholder="Your email"
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!emailError}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Your password"
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              placeholder="Confirm your password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!confirmPasswordError}
            />
            <Form.Control.Feedback type="invalid">
              {confirmPasswordError}
            </Form.Control.Feedback>
          </Form.Group>
          <CommonButton
            variant="primary"
            type="submit"
            className="w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </CommonButton>
          {success && (
            <Alert key="success" variant="success">
              <p>
                Verification email sent successfully. Check your email for
                verification link.
              </p>
            </Alert>
          )}
          <div className="text-center">
            Already have an account? <Link to={ROUTES.LOGIN}>Login</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
}
