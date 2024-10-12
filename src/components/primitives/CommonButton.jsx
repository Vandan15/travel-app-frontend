import React from "react";
import { Button } from "react-bootstrap";
import "./premitives.css";

export default function CommonButton({ children, ...props }) {
  return (
    <Button {...props} className={`common-btn ${props?.className ?? ""}`}>
      {children}
    </Button>
  );
}
