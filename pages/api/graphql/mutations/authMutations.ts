import { gql } from "@apollo/client";

export const registerMutation = gql`
  mutation SignUpMutation($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      token
      username
      email
      userid
    }
  }
`;

export const loginMutation = gql`
  mutation loginMutation($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      username
      email
    }
  }
`;

export const SignOutMutation = gql`
  mutation SignOutMutation {
    signOut
  }
`;

export const ResetPasswordMutation = gql`
  mutation ResetPasswordMutation($email: String!, $password: String!, $token: String!){
    resetPassword(input: { email: $email, password: $password, token: $token }) {
      token
      username
      email
    }
  }
`;