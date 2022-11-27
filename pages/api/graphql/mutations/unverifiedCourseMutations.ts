import { gql } from "@apollo/client";

export const saveUnverifiedCourseParMutation = gql`
  mutation saveUnverifiedCoursePar($unverifiedCourseId: String!, $userAddedPar: [String]!) {
    saveUnverifiedCoursePar(input: { unverifiedCourseId: $unverifiedCourseId, userAddedPar: $userAddedPar }) {
      user_added_par
    }
  }
`;
