import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function createData(
  hole: number,
  par: number,
  score: number,
  distance: number,
  handicap: number,
  history: any[]
) {
  return {
    hole,
    par,
    score,
    distance,
    handicap,
    history,
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.hole}
        </TableCell>
        <TableCell align="right">{row.par}</TableCell>
        <TableCell align="right">{row.score}</TableCell>
        <TableCell align="right">{row.distance}</TableCell>
        <TableCell align="right">{row.handicap}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detail
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Shot #</TableCell>
                    <TableCell>Club</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map(historyRow => (
                    <TableRow key={historyRow.shot}>
                      <TableCell>{historyRow.shot}</TableCell>
                      <TableCell component="th" scope="row">
                        {historyRow.club}
                      </TableCell>
                      <TableCell>{historyRow.result}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData(1, 4, 5, 350, 1, [
    {
      shot: 1,
      club: "Hybrid",
      result: "bunker",
    },
  ]),
  createData(2, 4, 5, 350, 1, [
    {
      shot: 1,
      club: "7i",
      result: "bunker",
    },
  ]),
  createData(3, 4, 5, 350, 1, [
    {
      shot: 1,
      club: "Driver",
      result: "bunker",
    },
  ]),
];

export default function ScoreCard() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Hole</TableCell>
            <TableCell align="right">Par</TableCell>
            <TableCell align="right">Score</TableCell>
            <TableCell align="right">Distance</TableCell>
            <TableCell align="right">Handicap</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <Row key={row.hole} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
