import { gql } from 'apollo-server-micro';


export const typeDefs = gql`
  type User {
    userid: String
    username: String
    email: String
    password: String
  }

  type Query {
    users: [User]!,
    user(userid: String!): User
  } 
`;