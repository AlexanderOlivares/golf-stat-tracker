import { gql } from "@apollo/client";

export const typeDefs = gql`
  type User {
    userid: String
    username: String
    email: String
  }

  type LoggedInUser {
    userid: String
    username: String
    email: String
    token: String
  }

  type CourseNamesAndIds {
    course_name: String
    course_id: String
  }

  type CourseSearchResult {
    courseName: String
    country: String
    state: String
    city: String
  }

  input RegistrationInput {
    username: String
    email: String
    password: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Course {
    course_id: String
    course_name: String
    course_country: String
    course_city: String
    course_state: String
    is_nine_hole_course: Boolean
    blue_par_front: [String]
    blue_par_back: [String]
    blue_hole_yardage_front: [String]
    blue_hole_yardage_back: [String]
    blue_total_yardage_front: String
    blue_total_yardage_back: String
    blue_handicap_front: [String]
    blue_handicap_back: [String]
    blue_slope: String
    blue_rating: String
    white_par_front: [String]
    white_par_back: [String]
    white_hole_yardage_front: [String]
    white_hole_yardage_back: [String]
    white_total_yardage_front: String
    white_total_yardage_back: String
    white_handicap_front: [String]
    white_handicap_back: [String]
    white_slope: String
    white_rating: String
    red_par_front: [String]
    red_par_back: [String]
    red_hole_yardage_front: [String]
    red_hole_yardage_back: [String]
    red_total_yardage_front: String
    red_total_yardage_back: String
    red_handicap_front: [String]
    red_handicap_back: [String]
    red_slope: String
    red_rating: String
  }

  input NewRound {
    roundid: String!
    courseName: String
    courseId: String
    username: String!
    holeCount: Int!
    teeColor: String!
    roundDate: String
    frontOrBackNine: String!
    isUserAddedCourse: Boolean!
    weatherConditions: String!
    temperature: Int!
    userAddedCourseName: String
    userAddedCity: String
    userAddedState: String
    unverifiedCourseId: String
    clubs: [String]
  }

  scalar JSON

  type NewRoundResponse {
    round_id: String!
    course_name: String
    course_id: String
    username: String!
    hole_count: Int!
    tee_color: String!
    round_date: String
    front_or_back_nine: String!
    is_user_added_course: Boolean!
    weather_conditions: String!
    temperature: Int!
    user_added_course_name: String
    user_added_city: String
    user_added_state: String
    unverified_course_id: String
    clubs: [String]
    hole_scores: [Int]
    hole_shot_details: JSON
    # hole_shot_details: String
  }

  type UserClubs {
    userid: String!
    username: String!
    email: String!
    using_default_clubs: Boolean!
    clubs: [String]!
  }

  input UpdateClubsInput {
    username: String!
    clubs: [String]!
  }

  type ClubList {
    clubs: [String]
  }

  input RoundStats {
    holeScores: [Int]
    holeShotDetails: JSON
    roundid: String
    username: String
  }

  type RoundStatsResponse {
    hole_scores: [Int]
    hole_shot_details: JSON
    username: String
  }

  type RoundPreviewResponse {
    round_id: String!
    course_id: String
    course_name: String
    tee_color: String!
    round_date: String
    is_user_added_course: Boolean!
    #   user_added_course_name
    unverified_course_id: String
    score: Int
    fairwaysHit: String
    greensInReg: Int
    threePutts: Int
    totalPutts: Int
  }

  type UnverifiedCourse {
    user_added_par: [String]!
  }

  input UpdateUserAddedCourseParInput {
    unverifiedCourseId: String!
    userAddedPar: [String]!
    username: String!
  }

  type Query {
    passwordResetEmailRequest(email: String!): String
    user(username: String!): User
    courses: [CourseNamesAndIds]
    course(courseId: String!): [Course]!
    unverifiedCourse(unverifiedCourseId: String!): [UnverifiedCourse]
    round(roundid: String!): NewRoundResponse
    roundPreview(username: String!): [RoundPreviewResponse]
    clubs(username: String!): UserClubs!
  }

  type Mutation {
    register(input: RegistrationInput!): LoggedInUser
    login(input: LoginInput!): LoggedInUser
    signOut: Boolean!
    newRound(input: NewRound!): NewRoundResponse
    editClubs(input: UpdateClubsInput!): ClubList
    saveRound(input: RoundStats!): RoundStatsResponse
    saveUnverifiedCoursePar(input: UpdateUserAddedCourseParInput): UnverifiedCourse
  }
`;
