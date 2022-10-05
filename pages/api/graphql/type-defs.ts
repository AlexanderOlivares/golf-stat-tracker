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

  type Token {
    userid: String
    username: String
    email: String
    exp: Int
  }
  
  type CourseName {
    course_name: String
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
    users: [User]! # not currently used but keeping for git
    user(username: String!): User
    token: Token
    getAllCourses: [CourseName]
    courseSearchResults(courseName: String!): [CourseSearchResult]! # not currently used but keeping for git
  } 

  type Mutation {
    register(input: RegistrationInput!): LoggedInUser
    login(input: LoginInput!): LoggedInUser
    signOut: Boolean!
  }
`;