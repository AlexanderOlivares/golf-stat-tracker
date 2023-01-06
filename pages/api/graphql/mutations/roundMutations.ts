import { gql } from "@apollo/client";

export const createNewRound = gql`
  mutation CreateNewRound(
    $roundid: String!
    $courseName: String
    $courseId: String
    $username: String!
    $holeCount: Int!
    $teeColor: String!
    $roundDate: String
    $frontOrBackNine: String!
    $isUserAddedCourse: Boolean!
    $weatherConditions: String!
    $temperature: Int!
    $userAddedCourseName: String
    $userAddedCity: String
    $userAddedState: String
    $unverifiedCourseId: String
  ) {
    newRound(
      input: {
        roundid: $roundid
        courseName: $courseName
        courseId: $courseId
        username: $username
        holeCount: $holeCount
        teeColor: $teeColor
        roundDate: $roundDate
        frontOrBackNine: $frontOrBackNine
        isUserAddedCourse: $isUserAddedCourse
        weatherConditions: $weatherConditions
        temperature: $temperature
        userAddedCourseName: $userAddedCourseName
        userAddedCity: $userAddedCity
        userAddedState: $userAddedState
        unverifiedCourseId: $unverifiedCourseId
      }
    ) {
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
    }
  }
`;

export const saveRound = gql`
  mutation SaveRound($holeScores: [Int], $holeShotDetails: JSON, $roundid: String, $username: String) {
    saveRound(input: { holeScores: $holeScores, holeShotDetails: $holeShotDetails, roundid: $roundid, username: $username }) {
      hole_scores
      hole_shot_details
    }
  }
`;

export const deleteRoundMutation = gql`
  mutation DeleteRound($roundid: String, $username: String) {
    deleteRound(input: { roundid: $roundid, username: $username }) {
        roundid
    }
  }
`;
