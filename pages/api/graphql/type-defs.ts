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

  type Query {
    user(username: String!): User
    courses: [CourseNamesAndIds]
    course(courseId: String!, teeColor: String!): [Course]!
  } 

  type Mutation {
    register(input: RegistrationInput!): LoggedInUser
    login(input: LoginInput!): LoggedInUser
    signOut: Boolean!
  }
`;