import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button } from "@mui/material";
import RoundPreviewGrid from "../../components/RoundPreviewGrid";
import Typography from "@mui/material/Typography";
import { getRoundPreviewByUsernameQuery } from "../api/graphql/queries/roundQueries";
import { useAuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import AreaChart from "../../components/statCharts/AreaChart";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import apolloClient from "../../apollo-client";
import { queryParamToString } from "../../utils/queryParamFormatter";
import PieChart from "../../components/statCharts/PieChart";
import { scoreCountByNameArray } from "../../utils/statChartHelpers";

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
  ace: number | null;
  albatross: number | null;
  eagle: number | null;
  birdie: number | null;
  par: number | null;
  bogey: number | null;
  double_bogey: number | null;
  triple_bogey: number | null;
  quadruple_bogey_or_worse: number | null;
}

const trendStatKeys: (keyof IRoundPreview)[] = [
  "score",
  "fairwaysHit",
  "greensInReg",
  "threePutts",
  "totalPutts",
];

export const scoreByNamePieChartKeys: (keyof IRoundPreview)[] = [
  "ace",
  "albatross",
  "eagle",
  "birdie",
  "par",
  "bogey",
  "double_bogey",
  "triple_bogey",
  "quadruple_bogey_or_worse",
];

export default function Profile({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const authContext = useAuthContext();
  const { isAuth } = authContext.state;

  const username = router.query.username;
  const [roundPreviewRows, setRoundPrviewRows] = useState<IRoundPreview[] | null>(null);

  useEffect(() => {
    if (data?.roundPreview) {
      const roundPreviewArray: IRoundPreview[] = data.roundPreview;
      setRoundPrviewRows(roundPreviewArray);
    }
  }, []);

  const startNewRound = () => router.push(`/${username}/round/new-round`);

  return (
    <>
      <Box textAlign="center" my={3}>
        <Typography variant="h3">Golfer Profile</Typography>
        {isAuth && (
          <Box m={2}>
            <Button onClick={startNewRound} size="large" variant="contained" color="primary">
              new round
            </Button>
          </Box>
        )}
        {roundPreviewRows?.length && (
          <>
            <Typography variant="h6">Stat Dashboard - {queryParamToString(username)}</Typography>
            <Typography variant="caption">
              Showing Stats for Latest {roundPreviewRows?.length} rounds
            </Typography>
          </>
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
          <Box display="flex" flexWrap="wrap" justifyContent="center" maxWidth="md" margin="auto">
            {roundPreviewRows && (
              <Box>
                <PieChart
                  data={scoreCountByNameArray(roundPreviewRows, scoreByNamePieChartKeys)}
                  labels={scoreByNamePieChartKeys}
                />
              </Box>
            )}
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="center" maxWidth="md" margin="auto">
            {roundPreviewRows &&
              trendStatKeys.map((statKey: keyof IRoundPreview) => {
                return (
                  <Box key={statKey}>
                    <AreaChart roundPreview={roundPreviewRows} statKey={statKey} />
                  </Box>
                );
              })}
          </Box>
          <Box mt={4}>
            <Typography variant="h5">
              {roundPreviewRows?.length ? "Latest Rounds" : "No Rounds Recorded Yet"}
            </Typography>
          </Box>
          <Box py={2}>
            {roundPreviewRows && <RoundPreviewGrid roundPreview={roundPreviewRows} />}
          </Box>
        </>
      </Box>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { username } = context.query;

  const { data } = await apolloClient.query({
    query: getRoundPreviewByUsernameQuery,
    variables: { username },
  });

  return {
    props: {
      data,
    },
  };
};
