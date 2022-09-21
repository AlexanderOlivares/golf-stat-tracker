import React from "react";
import appolloClient from "../../apollo-client";
import { gql } from "@apollo/client";

export async function getStaticPaths() {
  const getUseridsQuery = gql`
    query getUsers {
      users {
        userid
      }
    }
  `;

  const { data } = await appolloClient.query({ query: getUseridsQuery });

  const paths: any = data.users.map((user: any) => {
    return {
      params: {
        userid: user.userid,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context: any) {
  const { userid } = context.params;
  const getUserQuery = gql`
    query getuser($userid: String!) {
      user(userid: $userid) {
        userid
        username
        email
      }
    }
  `;

  const res = await appolloClient.query({
    query: getUserQuery,
    variables: { userid },
  });

  return {
    props: {
      data: res.data,
    },
  };
}

export default function Profile(props: any) {
  const { userid, username, email } = props.data.user;
  return (
    <>
      <h1>Profile</h1>
      <h3>uerId: {userid}</h3>
      <h3>uername: {username}</h3>
      <h3>email: {email}</h3>
    </>
  );
}
