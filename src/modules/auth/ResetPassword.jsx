import React, { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { ROUTES } from "../../common/constant";
import AppLogo from "../../components/common/AppLogo";
import useRouter from "../../hooks/useRouter";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { navigate } = useRouter();

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.FORGET_PASSWORD, { replace: true });
    }
  }, [token, navigate]);

  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return re.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

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
      // Handle form submission
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
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="confirmPassword" className="mb-3">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmPassword}
              placeholder="Confirm new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!confirmPasswordError}
            />
            <Form.Control.Feedback type="invalid">
              {confirmPasswordError}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Reset Password
          </Button>
          <div className="text-center">
            Remember your password? <Link to={ROUTES.LOGIN}>Login</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
}
