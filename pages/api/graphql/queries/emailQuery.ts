import { gql } from "@apollo/client";

export const getUserByEmail = gql`
  query getUserByEmail($email: String!) {
    passwordResetEmailRequest(email: $email) 
  }
`;