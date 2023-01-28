import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  adhocStatCounter,
  formatScoreCard,
  IHoleDetails,
  NON_HOLE_ROWS,
} from "../utils/scoreCardFormatter";
import { IShotDetail } from "../utils/roundFormatter";
import { useRoundContext } from "../context/RoundContext";
import { useNetworkContext } from "../context/NetworkContext";
import { useMutation } from "@apollo/client";
import { saveRound as saveRoundMutation } from "../pages/api/graphql/mutations/roundMutations";
import { queryParamToString } from "../utils/queryParamFormatter";
import { saveUnverifiedCourseParMutation } from "../pages/api/graphql/mutations/unverifiedCourseMutations";
import Row, { displayDistanceYardage } from "./ScoreCardRow";
import { IScoreCardProps } from "../interfaces/scorecardInterface";
import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";
import { parseErrorMessage } from "../utils/errorMessage";
import { toast } from "react-toastify";
import PieChart from "./statCharts/PieChart";
import { scoreByNamePieChartKeys } from "../pages/[username]/profile";
import { getScoreCountByName } from "../utils/holeDetailsFormatter";
import { scoreByNamePieSliceHexArr } from "./statCharts/PieSliceHexLists";
import * as Sentry from "@sentry/nextjs";
import KeyValueCard from "./KeyValueCard";
import useMediaQuery from "./useMediaQuery";
import Grid from "@mui/material/Unstable_Grid2";
import { Skeleton } from "@mui/material";

export const statsOnlyHoles = Object.values(NON_HOLE_ROWS);

export function getHoleIndexToUpdate(hole: string): number {
  if (statsOnlyHoles.includes(hole)) {
    const holeIndexLookup = {
      out: 9,
      in: 19,
      total: 20,
      rating: 21,
      slope: 22,
      HCP: 23,
      NET: 24,
    };
    return holeIndexLookup[hole as keyof typeof holeIndexLookup];
  }
  return Number(hole) <= 9 ? Number(hole) - 1 : Number(hole);
}

export interface ICompleteScoreCard extends IHoleDetails {
  score: number | null;
  holeShotDetails: IShotDetail[];
}

function formatTotalYardageHeading(teeColor: string) {
  if (!teeColor) return;
  const capitalized = teeColor[0].toUpperCase() + teeColor.slice(1);
  return `${capitalized}`;
}

function formatParArray(holes: IHoleDetails[]) {
  return holes.map(hole => hole.par).slice(0, 20);
}

export default function ScoreCard(props: IScoreCardProps) {
  const isMobile = useMediaQuery(600);
  const router = useRouter();
  const roundContext = useRoundContext();
  const networkContext = useNetworkContext();
  const { hasNetworkConnection, offlineModeEnabled, mbps } = networkContext.state;
  const authContext = useAuthContext();
  const { isAuth, tokenPayload } = authContext.state;

  const [saveRound] = useMutation(saveRoundMutation);
  const [saveUnverifiedCoursePar] = useMutation(saveUnverifiedCourseParMutation);

  const scoreCardRows: IHoleDetails[] = formatScoreCard(props);
  const holeScores = props.hole_scores;
  const holeShotDetails = props.hole_shot_details;
  const isUserAddedCourse = props.is_user_added_course;
  const roundid = props.round_id;
  const clubs = props.clubs;
  const username = props.username;
  const usernameIsAuthorized = isAuth && tokenPayload?.username == username;

  const { rating } = scoreCardRows[21];
  const { slope } = scoreCardRows[22];

  const [roundRows, setRoundRows] = useState<ICompleteScoreCard[]>([]);

  useEffect(() => {
    roundContext.dispatch({
      type: "update scores and shot details and timestamp",
      payload: {
        ...roundContext.state,
        holeScores: holeScores,
        isUserAddedCourse,
        holeShotDetails,
        par: isUserAddedCourse ? props.user_added_par : formatParArray(scoreCardRows),
      },
    });
  }, [holeScores, holeShotDetails]);

  useEffect(() => {
    roundContext.dispatch({
      type: "update clubs",
      payload: {
        ...roundContext.state,
        clubs: [...clubs, "--"],
      },
    });

    let roundRows: ICompleteScoreCard[] = [];
    for (let i = 0; i < 21; i++) {
      roundRows[i] = {
        ...scoreCardRows[i],
        par: roundContext.state.par[i],
        score: roundContext.state.holeScores[i],
        holeShotDetails: roundContext.state.holeShotDetails[i],
      };
    }
    setRoundRows(roundRows);
  }, [roundContext.state.par]);

  useEffect(() => {
    const indexedDB = window.indexedDB;
    const request = indexedDB.open("GolfStatDb", 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("round", "readwrite");
      const store = transaction.objectStore("round");
      store.put({
        id: roundid,
        ...roundContext.state,
      });
    };
  }, [roundContext.state]);

  async function saveScoreCard() {
    try {
      const { holeScores, holeShotDetails, scoreCount } = roundContext.state;
      const { data } = await saveRound({
        variables: {
          holeScores,
          holeShotDetails,
          scoreCountByName: scoreCount,
          roundid: queryParamToString(roundid),
          username,
        },
      });
      if (data) {
        console.log("+++ saved scorecard to postgres +++");
        roundContext.dispatch({
          type: "update last save timestamp",
          payload: {
            ...roundContext.state,
            lastSaveTimestamp: Date.now(),
          },
        });
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
      return router.push("/login");
    }
  }

  async function saveUnverifiedPar() {
    try {
      const { data } = await saveUnverifiedCoursePar({
        variables: {
          userAddedPar: roundContext.state.par,
          unverifiedCourseId: props.unverified_course_id,
          username,
        },
      });
      if (data) console.log("+++ saved unverified par to postgres +++");
    } catch (error) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
      return router.push("/login");
    }
  }

  function roundContextHydrationCheck() {
    const { holeScores, par, holeShotDetails, scoreCount } = roundContext.state;
    if (holeScores.length != 25 || holeShotDetails.length != 25 || !par.length) {
      return false;
    }
    if (Object.values(scoreCount).every((scoreCount: number) => scoreCount == 0)) return false;
    return true;
  }

  useEffect(() => {
    if (usernameIsAuthorized) {
      const roundContextIsHydrated = roundContextHydrationCheck();
      if (roundContextIsHydrated && hasNetworkConnection && !offlineModeEnabled) {
        saveScoreCard();
        if (roundContext.state.isUserAddedCourse) saveUnverifiedPar();
      }
    }
  }, [offlineModeEnabled, hasNetworkConnection]);

  useEffect(() => {
    const backgroundSyncInterval = setInterval(() => {
      // make sure connection is good enough to sync
      if (usernameIsAuthorized && hasNetworkConnection && mbps > 10) {
        const now = Date.now();
        const roundContextIsHydrated = roundContextHydrationCheck();
        if (now - roundContext.state.lastSaveTimestamp > 60000 && roundContextIsHydrated) {
          saveScoreCard();
          if (roundContext.state.isUserAddedCourse) {
            saveUnverifiedPar();
          }
        }
      }
    }, 15000);
    return () => clearInterval(backgroundSyncInterval);
  }, [
    roundContext.state.lastSaveTimestamp,
    roundContext.state.holeScores,
    roundContext.state.holeShotDetails,
  ]);

  useEffect(() => {
    const warningText = "Click OK to save offline changes before navigating away";
    const offlineWarningText = "Poor network connection. Re-connect to save changes";
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!networkContext.state.offlineModeEnabled) return;
      e.preventDefault();
      return (e.returnValue = warningText);
    };
    const handleBrowseAway = () => {
      const roundContextIsHydrated = roundContextHydrationCheck();
      if (!hasNetworkConnection) {
        window.alert(offlineWarningText);
      } else {
        if (window.confirm(warningText)) {
          if (hasNetworkConnection && roundContextIsHydrated) {
            saveScoreCard();
            if (roundContext.state.isUserAddedCourse) saveUnverifiedPar();
            networkContext.dispatch({
              type: "update offline mode enabled",
              payload: {
                ...networkContext.state,
                offlineModeEnabled: false,
              },
            });
            return;
          }
          return;
        }
      }
      router.events.emit("routeChangeError");
    };

    if (usernameIsAuthorized) {
      if (offlineModeEnabled || !hasNetworkConnection) {
        window.addEventListener("beforeunload", handleWindowClose);
        window.addEventListener("beforeunload", handleBrowseAway);
        router.events.on("routeChangeStart", handleBrowseAway);
      }
      return () => {
        window.removeEventListener("beforeunload", handleBrowseAway);
        window.removeEventListener("beforeunload", handleWindowClose);
        router.events.off("routeChangeStart", handleBrowseAway);
      };
    }
  }, [offlineModeEnabled, hasNetworkConnection]);

  useEffect(() => {
    const { par, holeScores } = roundContext.state;
    const updatedScoreCountByName = getScoreCountByName(holeScores, par);
    roundContext.dispatch({
      type: "update score count by name",
      payload: {
        ...roundContext.state,
        scoreCount: updatedScoreCountByName,
      },
    });
  }, [roundContext.state.holeScores]);

  return (
    <>
      <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        justifyContent="center"
        alignItems="center"
        direction="row"
        sx={{ maxWidth: "sm", margin: "auto" }}
      >
        <Grid xs={4} md={4}>
          <KeyValueCard label={"Tees"} value={formatTotalYardageHeading(props.tee_color) || "--"} />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard label={"Distance"} value={displayDistanceYardage(roundRows[20]) || "--"} />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={isMobile ? "Rat/Slp" : "Rating/Slope"}
            value={rating && slope ? `${rating}/${slope}` : "--"}
          />
        </Grid>
      </Grid>
      <Box py={2}>
        <Typography variant="h3">Score</Typography>
        <Typography variant="h3">{roundContext.state.holeScores[20] || 0}</Typography>
      </Box>
      <Box
        sx={{
          maxWidth: "sm",
          m: "auto",
        }}
        pb={2}
      >
        {roundContext.state.holeScores[20] ? (
          <KeyValueCard
            label={"Breakdown"}
            value={
              <PieChart
                data={Object.values(roundContext.state.scoreCount)}
                labels={scoreByNamePieChartKeys}
                pieSliceHexArr={scoreByNamePieSliceHexArr}
              />
            }
          />
        ) : (
          <KeyValueCard
            label={"Add Scores to see breakdown"}
            value={
              <>
                <Skeleton
                  animation={false}
                  variant="text"
                  width={300}
                  sx={{ maxWidth: "sm", margin: "auto" }}
                />
                <Skeleton
                  animation={false}
                  variant="text"
                  width={300}
                  sx={{ maxWidth: "sm", margin: "auto" }}
                />
                <Skeleton
                  animation={false}
                  variant="circular"
                  width={isMobile ? 300 : 450}
                  height={isMobile ? 300 : 450}
                  sx={{ maxWidth: "sm", margin: "auto", mt: 5 }}
                />
              </>
            }
          />
        )}
      </Box>
      <Grid
        container
        spacing={{ xs: 1, md: 2 }}
        justifyContent="center"
        alignItems="center"
        direction="row"
        sx={{ maxWidth: "sm", margin: "auto" }}
      >
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"FW Hit"}
            value={roundContext.state.holeShotDetails[20][0]["fairwaysHit"] || "--"}
          />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"GIR"}
            value={roundContext.state.holeShotDetails[20][0]["greensInReg"] || "--"}
          />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"Putts"}
            value={roundContext.state.holeShotDetails[20][0]["totalPutts"] || "--"}
          />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"3-Putts"}
            value={roundContext.state.holeShotDetails[20][0]["threePutts"] || "--"}
          />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"Penalty"}
            value={adhocStatCounter(roundContext.state.holeShotDetails).penalties || "--"}
          />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"Mishits"}
            value={adhocStatCounter(roundContext.state.holeShotDetails).mishits || "--"}
          />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"Up and Downs"}
            value={adhocStatCounter(roundContext.state.holeShotDetails).upAndDowns || "--"}
          />
        </Grid>
        <Grid xs={4} md={4}>
          <KeyValueCard
            label={"Potential Score"}
            value={
              roundContext.state.holeScores[20] +
                adhocStatCounter(roundContext.state.holeShotDetails).potentialScore || "--"
              // add 3-putts to this and clean it up in a function
            }
          />
        </Grid>
        {/* <Grid xs={4} md={4}>
        TODO
          <KeyValueCard label={"Scramble"} value={rating && slope ? `${rating}/${slope}` : "--"} />
        </Grid> */}
      </Grid>
      <Box
        sx={{
          maxWidth: "lg",
          m: "auto",
        }}
        pb={8}
      >
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#ffcdd2" }}>
                <TableCell>Hole</TableCell>
                <TableCell align="right">Par</TableCell>
                <TableCell align="right">Score</TableCell>
                {!roundContext.state.isUserAddedCourse && (
                  <>
                    <TableCell align="right">Distance</TableCell>
                    <TableCell align="right">Handicap</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {roundRows.map(row => (
                <Row key={row.hole} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
