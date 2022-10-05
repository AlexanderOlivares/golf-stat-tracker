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

export const getAllCourseNamesQuery = gql`
  query getAllCourseNames {
    getAllCourses {
      course_name
    }
  }
`;