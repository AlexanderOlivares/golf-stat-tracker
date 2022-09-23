import { gql } from "@apollo/client";

export const getUserQuery = gql`
  query getuser($username: String!) {
    user(username: $username) {
      userid
      username
      email
    }
  }
`;

export const getUsersQuery = gql`
  query getusers {
    users {
      userid
      username
      email
    }
  }
`;