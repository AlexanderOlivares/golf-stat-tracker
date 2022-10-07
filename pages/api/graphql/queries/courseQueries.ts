import { gql } from "@apollo/client";

// not using but keeping for git
export const searchCourseResultsQuery = gql`
  query searchCourses($courseName: String!) {
    courseSearchResults(courseName: $courseName) {
      courseName
      country
      state
      city
    }
  }
`;

export const getCourses = gql`
  query getCourseNamesAndIds {
    courses {
      course_name
      course_id
    }
  }
`;