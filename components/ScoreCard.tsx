import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IScoreCardProps } from "../pages/[username]/round/[roundid]";
import { formatScoreCard, IHoleDetails } from "../utils/scoreCardFormatter";
// import { ISingleHoleDtail } from "../utils/roundFormatter";
import { HoleDetailModal } from "../components/HoleDetailModal";
import { IShotDetail } from "../utils/roundFormatter";
import { useRoundContext } from "../context/RoundContext";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { queryParamToString } from "../utils/queryParamFormatter";
import { getUserClubsQuery } from "../pages/api/graphql/queries/clubQueries";

function showAltTableHeaders(holeNumber: string | undefined): boolean {
  if (!holeNumber) return false;
  const altHoleMatches = ["in", "out", "total", "rating", "slope", "HCP", "NET"];
  return altHoleMatches.includes(holeNumber);
}

function Row(props: { row: ICompleteScoreCard }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <TableRow onClick={() => setOpen(!open)} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell component="th" scope="row">
          {row.hole}
        </TableCell>
        <TableCell align="right">{row.totalPar ? row.totalPar : row.par}</TableCell>
        <TableCell align="right">{row.score}</TableCell>
        <TableCell align="right">{row.yardage}</TableCell>
        <TableCell align="right">{row.handicap}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Box textAlign="center" p={1}>
                <HoleDetailModal row={row} />
              </Box>
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
                  {row.holeShotDetails.map((detail: IShotDetail, i: number) => (
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

export default function ScoreCard(props: IScoreCardProps) {
  const roundContext = useRoundContext();
  const router = useRouter();
  const { username } = router.query;
  console.log("in scorecard comp");
  console.log(roundContext.state.holeScores);

  const scoreCardRows: IHoleDetails[] = formatScoreCard(props);
  const holeScores = props.hole_scores;
  const holeShotDetails = props.hole_shot_details;

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
          clubs: data.clubs.clubs,
        },
      });
    }
    roundContext.dispatch({
      type: "update scores and shot details",
      payload: {
        ...roundContext.state,
        holeScores: holeScores,
        holeShotDetails,
      },
    });
  }, [data, holeScores, holeShotDetails]);

  let roundRows: ICompleteScoreCard[] = [];

  for (let i = 0; i < scoreCardRows.length; i++) {
    roundRows[i] = {
      ...scoreCardRows[i],
      score: holeScores[i],
      holeShotDetails: holeShotDetails[i],
    };
  }

  //   console.log(roundRows);

  return (
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
  );
}
