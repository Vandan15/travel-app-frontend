import { gql } from "@apollo/client";

export const GET_CURRENT_USER = gql(`
query getUserDetails {
  getUserDetails {
    name
    email
    isEmailVerified
  }
}`);
