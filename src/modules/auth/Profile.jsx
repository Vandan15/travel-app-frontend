import React, { useContext } from "react";
import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import { AppContext } from "../../AppContext";
import { getInitials } from "../../common/utils";

export default function Profile() {
  const {
    state: { currentUser },
  } = useContext(AppContext);

  const initials = getInitials(currentUser?.name);

  return (
    <Container className="mt-5">
      <Card className="mt-5 p-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col xs={12} md={2} className="text-center mb-3 mb-md-0">
              <Badge
                pill
                bg="primary"
                style={{
                  width: "100px",
                  height: "100px",
                  fontSize: "2.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {initials}
              </Badge>
            </Col>
            <Col xs={12} md={10}>
              <Card.Title as="h2">{currentUser?.name ?? "-"}</Card.Title>
              <Card.Text>{currentUser?.email ?? "-"}</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
