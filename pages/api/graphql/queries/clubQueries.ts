import { gql } from "@apollo/client";

export const getUserClubsQuery = gql`
  query getuser($username: String!) {
    clubs(username: $username) {
      using_default_clubs
      clubs
    }
  }
`;