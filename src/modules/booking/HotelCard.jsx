import { useMutation } from "@apollo/client";
import { Star } from "phosphor-react";
import React from "react";
import { Alert, Button, Card, Carousel } from "react-bootstrap";
import toast from "react-hot-toast";
import { ROUTES } from "../../common/constant";
import useRouter from "../../hooks/useRouter";
import { CREATE_BOOKING } from "../auth/graphql/mutations";
import "./hotel.css";

const HotelCard = ({ hotel, filterValues }) => {
  const { navigate } = useRouter();
  console.log(filterValues);
  const [saveBookingMutate, { loading }] = useMutation(CREATE_BOOKING, {
    onError: () => {},
  });

  const handleBookNow = (id) => {
    saveBookingMutate({
      variables: {
        data: {
          checkIn: new Date(filterValues?.checkIn).toISOString(), // by default date is in ISO String format
          checkOut: new Date(filterValues?.checkOut).toISOString(),
          hotelId: id,
        },
      },
      onCompleted: (res) => {
        toast.success(res?.createUserBooking?.message);
      },
      onError: (err) => {
        if (err?.message === "Unauthorized") {
          navigate(ROUTES.LOGIN);
        }
      },
    });
  };
  return (
    <Card className="hotel-card">
      <Carousel interval={null}>
        {hotel?.hotelPictures.map((image, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100 hotel-image" src={image} alt="" />
          </Carousel.Item>
        ))}
      </Carousel>
      <Card.Body>
        <Card.Title>{hotel?.name}</Card.Title>
        <div className="rating">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              color={index < Math.floor(hotel.ratings) ? "#ffc107" : "#e4e5e9"}
              weight="fill"
            />
          ))}
        </div>
        <Card.Text>
          {hotel?.city} | {hotel?.country}
        </Card.Text>
        <Card.Text>{hotel?.description}</Card.Text>
        <Card.Text>
          <div className="price d-flex gap-2 align-items-center">
            <p>Rs.{hotel?.price}</p>
            <Alert variant="danger" className="p-0 px-1 mb-0">
              <strike>Rs.{hotel?.salePrice}</strike>
            </Alert>
          </div>
        </Card.Text>
        <Button
          variant="primary"
          className="book-now-btn"
          disabled={loading}
          onClick={() => handleBookNow(hotel?.id)}
        >
          Book Now
        </Button>
      </Card.Body>
    </Card>
  );
};

export default HotelCard;
