import React, { useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { HoleDetailModal } from "../components/HoleDetailModal";
import { IShotDetail } from "../utils/roundFormatter";
import { useRoundContext } from "../context/RoundContext";
import { getHoleIndexToUpdate, ICompleteScoreCard, statsOnlyHoles } from "./ScoreCard";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/router";

function showAltTableHeaders(holeNumber: string | undefined): boolean {
  if (!holeNumber) return false;
  const altHoleMatches = ["in", "out", "total", "rating", "slope", "HCP", "NET"];
  return altHoleMatches.includes(holeNumber);
}

export function displayDistanceYardage(row: ICompleteScoreCard) {
  if (!row) return;
  if (row.frontTotalYardage) return row.frontTotalYardage;
  if (row.backTotalYardage) return row.backTotalYardage;
  if (row.totalYardage) return row.totalYardage;
  return row.yardage;
}

export default function Row(props: { row: ICompleteScoreCard }) {
  const router = useRouter();
  const { username } = router.query;
  const { row } = props;
  const [open, setOpen] = useState(false);
  const roundContext = useRoundContext();
  const { state } = roundContext;
  const holeIndex = getHoleIndexToUpdate(row.hole);
  const authContext = useAuthContext();
  const { isAuth, tokenPayload } = authContext.state;
  const usernameIsAuthorized = isAuth && tokenPayload?.username == username;

  function stripedRowLogic() {
    if ([9, 19, 20].includes(holeIndex)) return "#ffcdd2";
    if (holeIndex % 2 != 0) return "#c8e6c9";
    return "white";
  }

  return (
    <>
      <TableRow onClick={() => setOpen(!open)} sx={{ backgroundColor: stripedRowLogic() }}>
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
              {usernameIsAuthorized && !statsOnlyHoles.includes(String(row.hole)) && (
                <Box textAlign="center" p={1}>
                  <HoleDetailModal row={row} />
                </Box>
              )}
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>{showAltTableHeaders(row.hole) ? "Fairways Hit" : "Shot"}</TableCell>
                    <TableCell>{showAltTableHeaders(row.hole) ? "GIR" : "Distance"}</TableCell>
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
