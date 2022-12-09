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
      type: "update scores and shot details",
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
    request.onupgradeneeded = () => {
      const db = request.result;
      const store = db.createObjectStore("rounds", { keyPath: "id" });
      store.createIndex(
        "roundDetails",
        ["clubs", "holeScores", "holeShotDetails", "isUserAddedCourse", "par"],
        { unique: false }
      );
    };
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction("rounds", "readwrite");
      const store = transaction.objectStore("rounds");
      store.put({
        id: roundid,
        ...roundContext.state,
      });
    };
  }, [roundContext.state]);

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
