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

  type Query {
    user(username: String!): User
    courses: [CourseNamesAndIds]
  } 

  type Mutation {
    register(input: RegistrationInput!): LoggedInUser
    login(input: LoginInput!): LoggedInUser
    signOut: Boolean!
  }
`;