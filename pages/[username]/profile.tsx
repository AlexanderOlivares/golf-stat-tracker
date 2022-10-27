import React from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getUserQuery } from "../api/graphql/queries/userQueries";
import { Box, Button } from "@mui/material";

export default function Profile() {
  const router = useRouter();

  const username = router.query.username;

  const { loading, error, data } = useQuery(getUserQuery, {
    variables: { username },
  });

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const startNewRound = () => router.push(`/${username}/round/new-round`);
  const editClubSelection = () => router.push(`/${username}/edit-profile`);

  return (
    <>
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <Box ml={5}>
          <h1>Profile</h1>
          <h3>uerId: {data.user.userid}</h3>
          <h3>uername: {data.user.username}</h3>
          <h3>email: {data.user.email}</h3>
          <Button onClick={editClubSelection} size="medium" variant="contained" color="primary">
            Edit my clubs
          </Button>
          <Box m={2}>
            <Button onClick={startNewRound} size="medium" variant="contained" color="primary">
              new round
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
