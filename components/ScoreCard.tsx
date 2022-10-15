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
import { ICourseTeeInfo } from "../pages/[username]/round/[roundid]";
import { ParsedUrlQuery } from "querystring";

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

interface IHoleDetails {
  hole?: string;
  par?: string;
  totalPar?: string;
  yardage?: string;
  frontTotalYardage?: string;
  backTotalYardage?: string;
  totalYardage?: string;
  handicap?: string;
  score?: string;
  out?: string;
  in?: string;
  total?: string;
  rating?: string;
  slope?: string;
  HCP?: string;
  NET?: string;
}

enum NON_HOLE_ROWS {
  out = 9,
  in = 19,
  total = 20,
  rating = 21,
  slope = 22,
  HCP = 23,
  NET = 24,
}

export default function ScoreCard(props: ICourseTeeInfo | ParsedUrlQuery) {
  console.log(props);
  const { teeColor } = props;

  const SCORE_CARD_ROWS_LENGTH = 25;
  let scoreCardRows = Array.from({ length: SCORE_CARD_ROWS_LENGTH }, (_, i) => {
    let holeDetails: IHoleDetails = {};
    if (i == 9 || i > 18) {
      if (i in NON_HOLE_ROWS) {
        holeDetails["hole"] = NON_HOLE_ROWS[i];
        return holeDetails;
      }
    }

    let offset = 1;
    if (i > 9) offset--;

    holeDetails["hole"] = (i + offset).toString();
    return holeDetails;
  });

  let totalPar = 0;
  for (let [key, val] of Object.entries(props)) {
    if (!val) continue;
    mapFrontNineValues(key, val, `${teeColor}_par_front`, "par");
    mapFrontNineValues(key, val, `${teeColor}_hole_yardage_front`, "yardage");
    mapFrontNineValues(key, val, `${teeColor}_handicap_front`, "handicap");
    mapTotalYardages(key, val, `${teeColor}_total_yardage_front`, "frontTotalYardage", false);

    mapOneOffProperties(key, val, `${teeColor}_rating`, "rating", 21);
    mapOneOffProperties(key, val, `${teeColor}_slope`, "slope", 22);

    mapTotalPar(key, val, `${teeColor}_par_front`, `${teeColor}_par_back`, "totalPar");

    if (!props.is_nine_hole_course) {
      mapBackNineValues(key, val, `${teeColor}_par_back`, "par");
      mapBackNineValues(key, val, `${teeColor}_hole_yardage_back`, "yardage");
      mapBackNineValues(key, val, `${teeColor}_handicap_back`, "handicap");
      mapTotalYardages(key, val, `${teeColor}_total_yardage_back`, "backTotalYardage", false);
    }

    // duplicate the back 9 holes with info from front 9
    if (props.is_nine_hole_course && props.holeCount == "18") {
      mapBackNineValues(key, val, `${teeColor}_par_front`, "par");
      mapBackNineValues(key, val, `${teeColor}_hole_yardage_front`, "yardage");
      mapBackNineValues(key, val, `${teeColor}_handicap_front`, "handicap");
      mapTotalYardages(key, val, `${teeColor}_total_yardage_back`, "frontTotalYardage", true);
    }
  }

  function mapTotalYardages(
    key: string,
    val: string,
    keyNameToCheck: string,
    mapPropertyName: keyof IHoleDetails,
    repeatSameNine: boolean
  ) {
    if (repeatSameNine) {
      const teeColorRegex = new RegExp(`${teeColor}_total_yardage_front`);
      if (teeColorRegex.test(key)) {
        scoreCardRows[19][mapPropertyName] = val;
        scoreCardRows[20]["totalYardage"] = String(Number(val) * 2);
        return;
      }
    }
    if (key == keyNameToCheck) {
      if (/total_yardage_front$/.test(keyNameToCheck)) {
        scoreCardRows[9][mapPropertyName] = val;
      }
      if (/total_yardage_back$/.test(keyNameToCheck)) {
        scoreCardRows[19][mapPropertyName] = val;
        scoreCardRows[20]["totalYardage"] = String(
          Number(val) + Number(scoreCardRows[9].frontTotalYardage)
        );
      }
    }
  }

  function mapTotalPar(
    key: string,
    val: string[],
    keyNameToCheckFront: string,
    keyNameToCheckBack: string,
    mapPropertyName: keyof IHoleDetails
  ) {
    if (key == keyNameToCheckFront || key == keyNameToCheckBack) {
      if (!val) return;
      console.log(val);
      totalPar += Number(val[val.length - 1]);
      scoreCardRows[20][mapPropertyName] = String(totalPar);
    }
  }

  function mapBackNineValues(
    key: string,
    val: string,
    keyNameToCheck: string,
    mapPropertyName: keyof IHoleDetails
  ) {
    if (key == keyNameToCheck) {
      for (let i = 10; i < scoreCardRows.length - 5; i++) {
        const valToAssign: string = val[i - 10];
        if (valToAssign) {
          scoreCardRows[i][mapPropertyName] = valToAssign;
        }
      }
    }
  }

  function mapFrontNineValues(
    key: string,
    val: string[],
    keyNameToCheck: string,
    mapPropertyName: keyof IHoleDetails
  ) {
    if (key == keyNameToCheck) {
      for (let i = 0; i < val.length; i++) {
        scoreCardRows[i][mapPropertyName] = val[i];
      }
    }
  }

  function mapOneOffProperties(
    key: string,
    val: string,
    keyNameToCheck: string,
    mapPropertyName: keyof IHoleDetails,
    scoreCardIndex: number
  ) {
    if (key == keyNameToCheck) {
      scoreCardRows[scoreCardIndex][mapPropertyName] = val;
    }
  }

  console.log(scoreCardRows);
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
