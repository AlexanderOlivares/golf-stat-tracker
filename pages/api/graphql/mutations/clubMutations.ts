import { gql } from "@apollo/client";

export const clubEditMutation = gql`
  mutation ClubEditMutation($clubs: [String]!, $username: String!) {
    editClubs(input: { clubs: $clubs, username: $username }) {
      clubs
    }
  }
`;