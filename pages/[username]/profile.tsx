import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { getUserQuery } from "../api/graphql/queries/userQueries";
import { Box, Button } from "@mui/material";
import RoundPreviewGrid from "../../components/RoundPreviewGrid";
import Typography from "@mui/material/Typography";
import { getRoundPreviewByUsernameQuery } from "../api/graphql/queries/roundQueries";
import { useNetworkContext } from "../../context/NetworkContext";
import { useAuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import AreaChart from "../../components/statCharts/AreaChart";

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

const statKeys: (keyof IRoundPreview)[] = [
  "score",
  "fairwaysHit",
  "greensInReg",
  "threePutts",
  "totalPutts",
];

export default function Profile() {
  const router = useRouter();
  const networkContext = useNetworkContext();
  const authContext = useAuthContext();
  const { isAuth } = authContext.state;

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
  }, [roundPreviews]);

  if (loading || roundPreviews.loading) return <LoadingSpinner />;
  if (error) return `Error! ${error.message}`;

  const startNewRound = () => router.push(`/${username}/round/new-round`);

  return (
    <>
      <Box textAlign="center" my={3}>
        <Typography variant="h3">Golfer Profile</Typography>
        <h3>{data.user.username}</h3>
        {isAuth && (
          <Box m={2}>
            <Button onClick={startNewRound} size="large" variant="contained" color="primary">
              new round
            </Button>
          </Box>
        )}
      </Box>
      <Box
        textAlign="center"
        sx={{
          maxWidth: "lg",
          m: "auto",
        }}
      >
        <>
          {roundPreviewRows &&
            statKeys.map((statKey: keyof IRoundPreview) => {
              return <AreaChart key={statKey} roundPreview={roundPreviewRows} statKey={statKey} />;
            })}
          <Typography variant="h6" component="h2">
            {roundPreviewRows?.length ? "Latest Rounds" : "No Rounds Recorded Yet"}
          </Typography>
          <Box py={2}>
            {roundPreviewRows && <RoundPreviewGrid roundPreview={roundPreviewRows} />}
          </Box>
        </>
      </Box>
    </>
  );
}
