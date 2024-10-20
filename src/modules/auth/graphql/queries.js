import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql(`
query getUserDetails {
  getUserDetails {
    name
    email
    isEmailVerified
  }
}`);

export const GET_ALL_LOCATIONS = gql(`
query Locations {
  locations {
    count
    locations
  }
}`);

export const GET_HOTELS_BY_LOCATION = gql(`
  query Hotels($filter: HotelsFilter!) {
  hotels(filter: $filter) {
    count
    hotels {
      name
      price
      salePrice
      ratings
      id
      hotelPictures
      description
      city
      country
    }
  }
}`);

export const GET_BOOKINGS_BY_USER = gql(`
  query UserBookings {
  userBookings {
    count
    userBookings {
      checkIn
      checkOut
      hotel {
        name
        price
        id
      }
      id
    }
  }
}`);
