import { gql } from "@apollo/client";

export const getUnverifiedCourseForRound = gql`
  query getUnverifiedCourseQuery($unverifiedCourseId: String!) {
    unverifiedCourse(unverifiedCourseId: $unverifiedCourseId) {
      user_added_par
    }
  }
`;
