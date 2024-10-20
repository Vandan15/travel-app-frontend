import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Col, Container, Row } from "react-bootstrap";
import "../AdvanceSearch/search.css";
// import
import { useLazyQuery, useQuery } from "@apollo/client";
import {
  GET_ALL_LOCATIONS,
  GET_HOTELS_BY_LOCATION,
} from "../../modules/auth/graphql/queries";
import CustomDropdown from "../CustomDropdown/CustomDropdown";

const AdvanceSearch = ({ onSubmit }) => {
  const [filterData, setFilterData] = useState({
    location: "",
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
  });
  const { data, loading } = useQuery(GET_ALL_LOCATIONS);
  const [fetchHotels] = useLazyQuery(GET_HOTELS_BY_LOCATION, {
    fetchPolicy: "network-only",
  });

  const selectedLocation = (value) => {
    setFilterData({
      ...filterData,
      location: value,
    });
  };

  const selectedGuest = (value) => {
    setFilterData({
      ...filterData,
      guest: value,
    });
  };

  const handleSubmit = () => {
    fetchHotels({
      variables: {
        filter: { location: filterData?.location },
      },
      onCompleted: (res) => {
        console.log(filterData);
        onSubmit(res?.hotels, filterData);
      },
    });
  };

  useEffect(() => {
    handleSubmit();
  }, [filterData]);

  return (
    <>
      <section className="box-search-advance">
        <Container>
          <Row>
            <Col md={12} xs={12}>
              <div className="box-search shadow-sm">
                <Row className="w-100">
                  <Col md={4} xs={12}>
                    <div className="item-search">
                      {/*  Using Props to Pass Data */}
                      {!loading && (
                        <CustomDropdown
                          label="Location"
                          onSelect={selectedLocation}
                          options={data?.locations?.locations.map(
                            (location) => location.city
                          )}
                        />
                      )}
                    </div>
                  </Col>
                  <Col md={4} xs={12}>
                    <div className="item-search item-search-2">
                      <label className="item-search-label"> Check in </label>
                      <DatePicker
                        selected={filterData?.checkIn}
                        onChange={(date) => {
                          console.log(date);
                          setFilterData({
                            ...filterData,
                            checkIn: date,
                          });
                        }}
                        dateFormat="dd, MMMM, yyyy"
                      />
                    </div>
                  </Col>
                  <Col md={4} xs={12}>
                    <div className="item-search item-search-2 no-before">
                      <label className="item-search-label"> Check Out </label>
                      <DatePicker
                        selected={filterData?.checkOut}
                        onChange={(date) =>
                          setFilterData({
                            ...filterData,
                            checkOut: date,
                          })
                        }
                        dateFormat="dd, MMMM, yyyy"
                      />
                    </div>
                  </Col>
                </Row>
                {/* <div className="item-search bd-none">
                  <CustomDropdown
                    label="Guest"
                    onSelect={selectedGuest}
                    options={[
                      "2 adults, 1 children",
                      "	2 adults, 1 children",
                      "2 adults, 3 children",
                    ]}
                  />
                </div> */}
                {/* <div className="item-search bd-none">
                  <Button
                    className="primaryBtn flex-even d-flex justify-content-center"
                    onClick={() => handleSubmit()}
                    disabled={
                      fetchLoading ||
                      !filterData?.location ||
                      !filterData?.checkIn ||
                      !filterData?.checkOut
                    }
                  >
                    <i className="bi bi-search me-2"></i> Search
                  </Button>
                </div> */}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AdvanceSearch;
