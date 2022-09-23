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
    users: [User]!,
    user(username: String!): User
  } 

  type Mutation {
    register(input: RegistrationInput!): LoggedInUser
    login(input: LoginInput!): LoggedInUser
    signOut: Boolean!
  }
`;