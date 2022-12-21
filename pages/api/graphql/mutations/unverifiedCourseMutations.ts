import { gql } from "@apollo/client";

export const saveUnverifiedCourseParMutation = gql`
  mutation saveUnverifiedCoursePar($unverifiedCourseId: String!, $userAddedPar: [String]!, $username: String!) {
    saveUnverifiedCoursePar(input: { unverifiedCourseId: $unverifiedCourseId, userAddedPar: $userAddedPar, username: $username }) {
      user_added_par
    }
  }
`;
