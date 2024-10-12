import { gql } from "@apollo/client";

export const EMAIL_LOGIN = gql(`
  mutation Login($data: LoginInput!) {
  login(data: $data) {
    accessToken
    message
    user {
      email
      name
      isEmailVerified
    }
  }
}`);

export const EMAIL_SIGNUP = gql(`
    mutation SignUp($data: SignupInput!) {
    signUp(data: $data) {
      message
      user {
        email
        isEmailVerified
        name
      }
    }
  }`);

export const FORGOT_PASSWORD = gql(`
  mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    message
  }
}`);

export const RESET_PASSWORD = gql(`
  mutation ResetPassword($data: ResetPasswordInput!) {
  resetPassword(data: $data) {
    message
  }
}`);

export const VERIFY_EMAIL = gql(`
  mutation VerifyEmail($data: VerifyEmailInput!) {
  verifyEmail(data: $data) {
    message
  }
}`);
