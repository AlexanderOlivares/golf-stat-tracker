import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
// import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
// import Button from "@mui/material/Button";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ICourseTeeInfo } from "../pages/[username]/round/[roundid]";
import { ParsedUrlQuery } from "querystring";
import { formatScoreCard, IHoleDetails } from "../utils/scoreCardFormatter";
import { userAddedRoundDetails, ISingleHoleDetail } from "../utils/roundFormatter";
import { HoleDetailModal } from "../components/HoleDetailModal";

function Row(props: { row: ICompleteScorecared }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  //   const [shotDetailCount, setShotDetailCount] = React.useState(1);

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
                <HoleDetailModal />
              </Box>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Shot #</TableCell>
                    <TableCell>Distance to Pin</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.details.map(detail => (
                    <TableRow key={detail.shotNumber}>
                      <TableCell>{detail.shotNumber}</TableCell>
                      <TableCell>{detail.distanceToPin || "--"}</TableCell>
                      <TableCell component="th" scope="row">
                        {detail.club || "--"}
                      </TableCell>
                      <TableCell>{detail.result || "--"}</TableCell>
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

interface ICompleteScorecared extends ISingleHoleDetail, IHoleDetails {}

export default function ScoreCard(props: ICourseTeeInfo | ParsedUrlQuery) {
  console.log(props);

  const scoreCardRows: IHoleDetails[] = formatScoreCard(props);
  const userAddedRows: ISingleHoleDetail[] = userAddedRoundDetails;

  let roundRows: ICompleteScorecared[] = [];

  for (let i = 0; i < scoreCardRows.length; i++) {
    roundRows[i] = {
      ...scoreCardRows[i],
      ...userAddedRows[i],
    };
  }
  console.log(roundRows);

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
