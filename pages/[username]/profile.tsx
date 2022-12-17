import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getUserQuery } from "../api/graphql/queries/userQueries";
import { Box, Button } from "@mui/material";
import RoundPreviewGrid from "../../components/RoundPreviewGrid";
import Typography from "@mui/material/Typography";
import { getRoundPreviewByUsernameQuery } from "../api/graphql/queries/roundQueries";
import { useNetworkContext } from "../../context/NetworkContext";

export interface IRoundPreview {
  round_id: string;
  course_id: string;
  unverified_course_id: string;
  course_name: string;
  tee_color: string;
  round_date: string;
  is_user_added_course: boolean;
  score: number;
  fairwaysHit: string;
  greensInReg: number;
  threePutts: number;
  totalPutts: number;
}

export default function Profile() {
  const router = useRouter();
  const networkContext = useNetworkContext();

  const username = router.query.username;
  const [roundPreviewRows, setRoundPrviewRows] = useState<IRoundPreview[] | null>(null);

  const { loading, error, data } = useQuery(getUserQuery, {
    variables: { username },
  });

  const roundPreviews = useQuery(getRoundPreviewByUsernameQuery, {
    variables: {
      username,
    },
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (roundPreviews?.data?.roundPreview) {
      const roundPreviewArray: IRoundPreview[] = roundPreviews.data.roundPreview;
      setRoundPrviewRows(roundPreviewArray);
    }
    if (networkContext.state.offlineModeEnabled) {
      // TODO add toast "you are in offline mode scores may not be up to date"
    }
  }, [roundPreviews]);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const startNewRound = () => router.push(`/${username}/round/new-round`);
  const editClubSelection = () => router.push(`/${username}/my-clubs`);

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
          <Box>
            <Typography variant="h6" component="h2">
              Latest Rounds
            </Typography>
            {roundPreviewRows && <RoundPreviewGrid roundPreview={roundPreviewRows} />}
          </Box>
        </Box>
      )}
    </>
  );
}
