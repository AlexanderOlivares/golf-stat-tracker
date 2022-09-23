import React from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getUserQuery } from "../api/graphql/queries/userQueries";

export default function Profile() {
  const router = useRouter();

  const username = router.query.username;

  const { loading, error, data } = useQuery(getUserQuery, {
    variables: { username },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <h1>Profile</h1>
          <h3>uerId: {data.user.userid}</h3>
          <h3>uername: {data.user.username}</h3>
          <h3>email: {data.user.email}</h3>
        </div>
      )}
    </>
  );
}
