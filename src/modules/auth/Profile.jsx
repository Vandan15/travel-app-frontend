import React, { useContext } from "react";
import { Badge, Card, Col, Container, Row } from "react-bootstrap";
import { AppContext } from "../../AppContext";
import { ROUTES } from "../../common/constant";
import { getInitials } from "../../common/utils";
import CommonButton from "../../components/primitives/CommonButton";
import useRouter from "../../hooks/useRouter";

export default function Profile() {
  const {
    state: { currentUser },
  } = useContext(AppContext);
  const { navigate } = useRouter();

  const initials = getInitials(currentUser?.name);

  const handleLogout = () => {
    navigate(ROUTES.LOGOUT, {
      replace: true,
    });
  };

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
              <div className="d-flex flex-column gap-3 align-items-start">
                <div>
                  <Card.Title as="h2">{currentUser?.name ?? "-"}</Card.Title>
                  <Card.Text>{currentUser?.email ?? "-"}</Card.Text>
                </div>
                <CommonButton onClick={handleLogout}>Logout</CommonButton>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
}
