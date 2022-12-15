import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IScoreCardProps } from "../pages/[username]/round/[roundid]";
import { formatScoreCard, IHoleDetails, NON_HOLE_ROWS } from "../utils/scoreCardFormatter";
import { HoleDetailModal } from "../components/HoleDetailModal";
import { IShotDetail } from "../utils/roundFormatter";
import { useRoundContext } from "../context/RoundContext";
import { Button } from "@mui/material";
import { useNetworkContext } from "../context/NetworkContext";
import { useMutation } from "@apollo/client";
import { saveRound as saveRoundMutation } from "../pages/api/graphql/mutations/roundMutations";
import { queryParamToString } from "../utils/queryParamFormatter";
import { saveUnverifiedCourseParMutation } from "../pages/api/graphql/mutations/unverifiedCourseMutations";

const statsOnlyHoles = Object.values(NON_HOLE_ROWS);

function showAltTableHeaders(holeNumber: string | undefined): boolean {
  if (!holeNumber) return false;
  const altHoleMatches = ["in", "out", "total", "rating", "slope", "HCP", "NET"];
  return altHoleMatches.includes(holeNumber);
}

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

function displayDistanceYardage(row: ICompleteScoreCard) {
  if (row.frontTotalYardage) return row.frontTotalYardage;
  if (row.backTotalYardage) return row.backTotalYardage;
  if (row.totalYardage) return row.totalYardage;
  return row.yardage;
}

function Row(props: { row: ICompleteScoreCard }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const roundContext = useRoundContext();
  const { state } = roundContext;
  const holeIndex = getHoleIndexToUpdate(row.hole);

  return (
    <>
      <TableRow onClick={() => setOpen(!open)} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          {row.hole}
        </TableCell>
        <TableCell align="right">{row.totalPar ? row.totalPar : row.par}</TableCell>
        <TableCell align="right">{state.holeScores[holeIndex]}</TableCell>
        {!roundContext.state.isUserAddedCourse && (
          <>
            <TableCell align="right">{displayDistanceYardage(row)}</TableCell>
            <TableCell align="right">{row.handicap}</TableCell>
          </>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              {!statsOnlyHoles.includes(String(row.hole)) && (
                <Box textAlign="center" p={1}>
                  <HoleDetailModal row={row} />
                </Box>
              )}
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {showAltTableHeaders(row.hole) ? "Fairways Hit" : "Shot #"}
                    </TableCell>
                    <TableCell>
                      {showAltTableHeaders(row.hole) ? "GIR" : "Distance to Pin"}
                    </TableCell>
                    <TableCell>{showAltTableHeaders(row.hole) ? "3-Putts" : "Club"}</TableCell>
                    <TableCell>
                      {showAltTableHeaders(row.hole) ? "Total Putts" : "Result"}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.holeShotDetails[holeIndex].map((detail: IShotDetail, i: number) => (
                    // make a better key here
                    <TableRow key={i}>
                      <TableCell>{detail.shotNumber || detail.fairwaysHit}</TableCell>
                      <TableCell>{detail.distanceToPin || detail.greensInReg}</TableCell>
                      <TableCell component="th" scope="row">
                        {detail.club || detail.threePutts}
                      </TableCell>
                      <TableCell>{detail.result || detail.totalPutts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export interface ICompleteScoreCard extends IHoleDetails {
  score: number | null;
  holeShotDetails: IShotDetail[];
}

function formatParArray(holes: IHoleDetails[]) {
  return holes.map(hole => hole.par).slice(0, 20);
}

export default function ScoreCard(props: IScoreCardProps) {
  const roundContext = useRoundContext();
  const networkContext = useNetworkContext();
  const { hasNetworkConnection, offlineModeEnabled, mbps } = networkContext.state;
  const [saveRound] = useMutation(saveRoundMutation);
  const [saveUnverifiedCoursePar] = useMutation(saveUnverifiedCourseParMutation);

  const scoreCardRows: IHoleDetails[] = formatScoreCard(props);
  const holeScores = props.hole_scores;
  const holeShotDetails = props.hole_shot_details;
  const isUserAddedCourse = props.is_user_added_course;
  const roundid = props.round_id;
  const clubs = props.clubs;
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

      const roundTransaction = db.transaction("roundBuildProps", "readwrite");
      const roundStore = roundTransaction.objectStore("roundBuildProps");
      const existingRoundQuery = roundStore.get(roundid);
      existingRoundQuery.onsuccess = () => {
        if (existingRoundQuery.result) {
          const copy = { ...existingRoundQuery.result };
          copy.hole_scores = roundContext.state.holeScores;
          copy.hole_shot_details = roundContext.state.holeShotDetails;
          roundStore.put({
            ...copy,
          });
        }
      };

      if (props.unverified_course_id) {
        const courseTransaction = db.transaction("courseBuildProps", "readwrite");
        const courseStore = courseTransaction.objectStore("courseBuildProps");
        const unverifiedCourseKey = queryParamToString(props.unverified_course_id);
        const unverifiedCourseQuery = courseStore.get(unverifiedCourseKey);
        unverifiedCourseQuery.onsuccess = () => {
          if (unverifiedCourseQuery.result) {
            const copy = { ...unverifiedCourseQuery.result };
            copy.user_added_par = roundContext.state.par;
            courseStore.put({
              ...copy,
            });
          }
        };
      }
    };
  }, [roundContext.state]);

  async function saveScoreCard() {
    const { holeScores, holeShotDetails } = roundContext.state;
    const { data } = await saveRound({
      variables: {
        holeScores,
        holeShotDetails,
        roundid: queryParamToString(roundid),
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
  }

  async function saveUnverifiedPar() {
    const { data } = await saveUnverifiedCoursePar({
      variables: {
        userAddedPar: roundContext.state.par,
        unverifiedCourseId: props.unverified_course_id,
      },
    });
    if (data) console.log("+++ saved unverified par to postgres +++");
  }

  // check this func and behavior when refreshing on/offline
  function roundContextHydrationCheck() {
    const { holeScores, par, holeShotDetails } = roundContext.state;
    if (holeScores.length != 25 || holeShotDetails.length != 25 || !par.length) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    const roundContextIsHydrated = roundContextHydrationCheck();
    if (roundContextIsHydrated) {
      if (hasNetworkConnection && !offlineModeEnabled) {
        saveScoreCard();
        if (roundContext.state.isUserAddedCourse) {
          saveUnverifiedPar();
        }
      }
    }
  }, [offlineModeEnabled, hasNetworkConnection]);

  useEffect(() => {
    const backgroundSyncInterval = setInterval(() => {
      // make sure connection is good enough to sync
      if (hasNetworkConnection && mbps > 10) {
        const now = Date.now();
        console.log(now);
        const roundContextIsHydrated = roundContextHydrationCheck();
        console.log(roundContextIsHydrated);
        if (now - roundContext.state.lastSaveTimestamp > 30000 && roundContextIsHydrated) {
          saveScoreCard();
          if (roundContext.state.isUserAddedCourse) {
            saveUnverifiedPar();
          }
        }
      }
    }, 5000);

    return () => clearInterval(backgroundSyncInterval);
  }, [roundContext.state.lastSaveTimestamp]);

  return (
    <>
      <Box>
        <Typography variant="h6" component="h2">
          Slope {slope}
        </Typography>
        <Typography variant="h6" component="h2">
          Rating {rating}
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow>
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
    </>
  );
}
