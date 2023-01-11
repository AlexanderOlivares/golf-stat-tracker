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
      clubs
      hole_scores
      hole_shot_details
    }
  }
`;

export const getRoundPreviewByUsernameQuery = gql`
  query getRoundPreviewByUsernameQuery($username: String!) {
    roundPreview(username: $username) {
      round_id
      course_id
      course_name
      tee_color
      round_date
      is_user_added_course
      #   user_added_course_name
      unverified_course_id
      score
      fairwaysHit
      greensInReg
      threePutts
      totalPutts
      ace
      albatross
      eagle
      birdie
      par
      bogey
      double_bogey
      triple_bogey
      quadruple_bogey_or_worse
    }
  }
`;
