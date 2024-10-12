import { useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { AppContext } from "../../AppContext";
import { ROUTES } from "../../common/constant";
import AppLogo from "../../components/common/AppLogo";
import CommonButton from "../../components/primitives/CommonButton";
import { EMAIL_LOGIN } from "./graphql/mutations";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { initializeAuth } = useContext(AppContext);

  const [loginMutate, { loading }] = useMutation(EMAIL_LOGIN, {
    onError: () => {},
  });

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

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      loginMutate({
        variables: { data: { email, password } },
        onCompleted: (response) => {
          const { accessToken, user } = response.login;
          setEmail("");
          setPassword("");
          setEmailError("");
          setPasswordError("");
          initializeAuth(accessToken, user);
          toast.success(response?.login?.message);
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
          <Form.Group className="mb-4" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={!!emailError}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formPassword">
            <div className="d-flex justify-content-between align-items-center">
              <Form.Label>Password</Form.Label>
              <Link to={ROUTES.FORGET_PASSWORD} className="small">
                Forgot Password?
              </Link>
            </div>
            <Form.Control
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>

          <CommonButton
            variant="primary"
            type="submit"
            className="w-100 mb-4"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </CommonButton>
          <div className="text-center">
            Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
}
