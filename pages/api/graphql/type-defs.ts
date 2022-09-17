import { gql } from "@apollo/client";


export const typeDefs = gql`
  type User {
    userid: String
    username: String
    email: String
  }

  type NewUser {
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
    username: String
    email: String
    password: String
  }

  type Query {
    users: [User]!,
    user(userid: String!): User
  } 

  type Mutation {
    register(input: RegistrationInput!): NewUser
    login(input: LoginInput!): String!
    # signOut: Boolean!
  }
`;