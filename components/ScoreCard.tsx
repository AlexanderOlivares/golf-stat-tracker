import React, { useEffect } from "react";
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
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { queryParamToString } from "../utils/queryParamFormatter";
import { getUserClubsQuery } from "../pages/api/graphql/queries/clubQueries";
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
        {/* <TableCell align="right">{row.score}</TableCell> */}
        <TableCell align="right">{state.holeScores[holeIndex]}</TableCell>
        <TableCell align="right">{row.yardage}</TableCell>
        <TableCell align="right">{row.handicap}</TableCell>
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
  const router = useRouter();
  const { username } = router.query;

  const scoreCardRows: IHoleDetails[] = formatScoreCard(props);
  const holeScores = props.hole_scores;
  const holeShotDetails = props.hole_shot_details;
  const { rating } = scoreCardRows[21];
  const { slope } = scoreCardRows[22];

  const { data, loading, error } = useQuery(getUserClubsQuery, {
    variables: {
      username: queryParamToString(username),
    },
  });

  useEffect(() => {
    if (data?.clubs.clubs) {
      roundContext.dispatch({
        type: "update clubs",
        payload: {
          ...roundContext.state,
          clubs: [...data.clubs.clubs, "--"],
        },
      });
    }
    roundContext.dispatch({
      type: "update scores and shot details",
      payload: {
        ...roundContext.state,
        holeScores: holeScores,
        holeShotDetails,
        par: formatParArray(scoreCardRows),
      },
    });
  }, [data, holeScores, holeShotDetails]);

  let roundRows: ICompleteScoreCard[] = [];

  // hiding rating, slope, index and handicap for now. should be i < scoreCardRows.length
  for (let i = 0; i < 21; i++) {
    roundRows[i] = {
      ...scoreCardRows[i],
      score: roundContext.state.holeScores[i],
      holeShotDetails: roundContext.state.holeShotDetails[i],
    };
  }

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
              <TableCell align="right">Distance</TableCell>
              <TableCell align="right">Handicap</TableCell>
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
