import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Button, Skeleton } from "@mui/material";
import RoundPreviewGrid from "../../components/RoundPreviewGrid";
import Typography from "@mui/material/Typography";
import { getRoundPreviewByUsernameQuery } from "../api/graphql/queries/roundQueries";
import { useAuthContext } from "../../context/AuthContext";
import AreaChart from "../../components/statCharts/AreaChart";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import apolloClient from "../../apollo-client";
import { queryParamToString } from "../../utils/queryParamFormatter";
import PieChart from "../../components/statCharts/PieChart";
import {
  getNumeratorOfFairwaysHit,
  getStatAverage,
  scoreCountByNameArray,
} from "../../utils/statChartHelpers";
import { scoreByNamePieSliceHexArr } from "../../components/statCharts/PieSliceHexLists";
import KeyValueCard from "../../components/KeyValueCard";
import * as Sentry from "@sentry/nextjs";
import LoadingSkeleton from "../../components/LoadingSkeleton";
import useMediaQuery from "../../components/useMediaQuery";

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
  const isMobile = useMediaQuery(600);
  const { isAuth } = authContext.state;
  const [isLoading, setIsloading] = useState(true);

  const username = router.query.username;
  const [roundPreviewRows, setRoundPrviewRows] = useState<IRoundPreview[] | null>(null);

  useEffect(() => {
    if (data?.roundPreview) {
      const roundPreviewArray: IRoundPreview[] = data.roundPreview;
      setRoundPrviewRows(roundPreviewArray);
      setIsloading(false);
    }
  }, []);

  useEffect(() => {
    if (roundPreviewRows) {
      setIsloading(false);
    }
  }, [roundPreviewRows]);

  const startNewRound = () => router.push(`/${username}/round/new-round`);

  return (
    <>
      <Box textAlign="center" my={3}>
        <Typography variant="h3">
          {isLoading ? (
            <Skeleton width={300} sx={{ margin: "auto" }} />
          ) : (
            queryParamToString(username)
          )}
        </Typography>
        <Box my={2}>
          <Typography variant="h4">
            {isLoading ? <Skeleton width={100} sx={{ margin: "auto" }} /> : "Stats"}
          </Typography>
          <Typography variant="caption">
            {isLoading ? (
              <Skeleton width={300} sx={{ margin: "auto" }} />
            ) : (
              `Averages & Trends From Last ${roundPreviewRows?.length} Rounds`
            )}
          </Typography>
        </Box>
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
            {trendStatKeys.map((statKey: keyof IRoundPreview) => {
              if (isLoading) {
                return <LoadingSkeleton key={statKey} />;
              }
              if (roundPreviewRows) {
                const statKeyDataOnly = roundPreviewRows.map(round => {
                  if (statKey == "fairwaysHit") return getNumeratorOfFairwaysHit(round[statKey]);
                  return round[statKey];
                });
                const avg: number = getStatAverage(statKeyDataOnly as number[]);
                return (
                  <Box key={statKey}>
                    <KeyValueCard
                      label={titleLookup[statKey as statKeyType]}
                      value={
                        <AreaChart
                          roundPreview={roundPreviewRows}
                          statKey={statKey}
                          avg={avg || 0}
                        />
                      }
                    />
                  </Box>
                );
              }
            })}
          </Box>
          <Box sx={{ maxWidth: "sm", margin: "auto", my: 4 }}>
            {isLoading ? (
              <Skeleton variant="rectangular" height={584} sx={{ maxWidth: "sm" }} />
            ) : (
              roundPreviewRows && (
                <KeyValueCard
                  label={
                    roundPreviewRows.length
                      ? "Scoring Breakdown"
                      : "Create a new round to see pie chart scoring breakdown"
                  }
                  value={
                    roundPreviewRows.length ? (
                      <PieChart
                        data={scoreCountByNameArray(roundPreviewRows, scoreByNamePieChartKeys)}
                        labels={scoreByNamePieChartKeys}
                        pieSliceHexArr={scoreByNamePieSliceHexArr}
                      />
                    ) : (
                      <>
                        <Skeleton
                          animation="wave"
                          variant="text"
                          width={300}
                          sx={{
                            margin: "auto",
                            bgcolor: isLoading ? "#e6e6e7" : "#a5d6a7",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          variant="text"
                          width={300}
                          sx={{
                            margin: "auto",
                            bgcolor: isLoading ? "#e6e6e7" : "#a5d6a7",
                          }}
                        />
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={isMobile ? 300 : 450}
                          height={isMobile ? 300 : 450}
                          sx={{
                            margin: "auto",
                            mt: 5,
                            bgcolor: isLoading ? "#e6e6e7" : "#a5d6a7",
                          }}
                        />
                      </>
                    )
                  }
                />
              )
            )}
          </Box>
          <Box mt={4}>
            <Typography variant="h4">
              {isLoading ? (
                <Skeleton width={350} sx={{ margin: "auto", pt: 4 }} />
              ) : (
                "Latest Rounds"
              )}
            </Typography>
            {isAuth && (
              <Box m={2}>
                <Button onClick={startNewRound} size="large" color="secondary" variant="contained">
                  new round
                </Button>
              </Box>
            )}
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
