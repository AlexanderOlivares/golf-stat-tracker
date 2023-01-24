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
import { scoreByNamePieSliceHexArr } from "../../components/statCharts/PieSliceHexLists";
import KeyValueCard from "../../components/KeyValueCard";
import * as Sentry from "@sentry/nextjs";

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

interface IChartTitleLookup {
  score: string;
  fairwaysHit: string;
  greensInReg: string;
  threePutts: string;
  totalPutts: string;
}

const titleLookup: IChartTitleLookup = {
  score: "Score",
  fairwaysHit: "Fairways Hit",
  greensInReg: "Greens In Regulation",
  threePutts: "3-Putts Or Worse",
  totalPutts: "Total Putts",
};

type statKeyType = keyof typeof titleLookup;

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
        <Typography variant="h3">{queryParamToString(username)}</Typography>
        {/* {isAuth && (
          <Box m={2}>
            <Button onClick={startNewRound} size="large" variant="contained" color="primary">
              new round
            </Button>
          </Box>
        )} */}
        {roundPreviewRows?.length && (
          <Box my={2}>
            <Typography variant="h4">Stats</Typography>
            <Typography variant="caption">
              Showing Trends From Last {roundPreviewRows?.length} Rounds
            </Typography>
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
          <Box display="flex" flexWrap="wrap" justifyContent="center" maxWidth="md" margin="auto">
            {roundPreviewRows &&
              trendStatKeys.map((statKey: keyof IRoundPreview) => {
                return (
                  <Box pb={2} key={statKey}>
                    <KeyValueCard
                      label={titleLookup[statKey as statKeyType]}
                      value={<AreaChart roundPreview={roundPreviewRows} statKey={statKey} />}
                    />
                  </Box>
                );
              })}
          </Box>
          <Box sx={{ maxWidth: "sm", margin: "auto", my: 4 }}>
            {roundPreviewRows && (
              <KeyValueCard
                label={"Scoring Breakdown"}
                value={
                  <PieChart
                    data={scoreCountByNameArray(roundPreviewRows, scoreByNamePieChartKeys)}
                    labels={scoreByNamePieChartKeys}
                    pieSliceHexArr={scoreByNamePieSliceHexArr}
                  />
                }
              />
            )}
          </Box>
          <Box mt={4}>
            <Typography variant="h4">
              {/* TODO add loading condition before rendering this */}
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
  try {
    const { username } = context.query;

    const { data } = await apolloClient.query({
      query: getRoundPreviewByUsernameQuery,
      variables: { username },
      fetchPolicy: "network-only",
    });

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    Sentry.captureException(error);
    return {
      redirect: {
        destination: "/login?redirected=true",
        permanent: false,
      },
    };
  }
};
