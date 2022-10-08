import { gql } from "@apollo/client";

export const getCourseForRound = gql`
  query course($courseId: String!, $teeColor: String!) {
    course(courseId: $courseId, teeColor: $teeColor) {
      course_name
      course_country
      course_city
      course_state
      is_nine_hole_course
      blue_par_front
      blue_par_back
      blue_hole_yardage_front
      blue_hole_yardage_back
      blue_total_yardage_front
      blue_total_yardage_back
      blue_handicap_front
      blue_handicap_back
      blue_slope
      blue_rating
      white_par_front
      white_par_back
      white_hole_yardage_front
      white_hole_yardage_back
      white_total_yardage_front
      white_total_yardage_back
      white_handicap_front
      white_handicap_back
      white_slope
      white_rating
      red_par_front
      red_par_back
      red_hole_yardage_front
      red_hole_yardage_back
      red_total_yardage_front
      red_total_yardage_back
      red_handicap_front
      red_handicap_back
      red_slope
      red_rating
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
