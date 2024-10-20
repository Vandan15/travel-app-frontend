import { map } from "lodash";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import HotelCard from "./HotelCard";

export default function HotelListings({ cardData, filterValues }) {
  return (
    <div style={{ background: "var(--secondaryClr)" }}>
      <Container>
        <Row className="d-flex flex-wrap p-3">
          {map(cardData, (hotel) => (
            <Col md={4}>
              <HotelCard hotel={hotel} filterValues={filterValues} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
