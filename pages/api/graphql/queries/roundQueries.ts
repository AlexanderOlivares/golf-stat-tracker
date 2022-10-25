import { gql } from "@apollo/client";

export const getRoundByIdQuery = gql`
  query getRoundById($roundid: String!) {
    round(roundid: $roundid) {
      round_id
      course_name
      course_id
      username
      hole_count
      tee_color
      round_date
      front_or_back_nine
      is_user_added_course
      weather_conditions
      temperature
      user_added_course_name
      user_added_city
      user_added_state
      unverified_course_id
      hole_scores
      hole_shot_details
    }
  }
`;
