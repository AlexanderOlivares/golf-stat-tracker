import { gql } from "@apollo/client";

export const getAuthTokenQuery = gql`
  query getAuthToken {
    token {
      userid
      username
      email
      exp
    }
  }
`;
