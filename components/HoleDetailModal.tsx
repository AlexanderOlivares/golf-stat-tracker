import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slider from "@mui/material/Slider";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ISingleHoleDetail, IShotDetail } from "../utils/roundFormatter";
import { ICompleteScoreCard } from "../components/ScoreCard";
import { useRoundContext } from "../context/RoundContext";
import { IRoundState } from "../context/RoundContext";
import { NON_HOLE_ROWS } from "../utils/scoreCardFormatter";

function valuetext(value: number) {
  return `${value}`;
}

export function HoleDetailModal({ row }: { row: ICompleteScoreCard }) {
  const roundContext = useRoundContext();

  const [open, setOpen] = React.useState(false);
  const [shotNumber, setShotNumber] = React.useState(1);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleShotNumberChange = (event: Event, newValue: number | number[]) => {
    setShotNumber(newValue as number);
    const updatedHoleScoresContext = (prevState: IRoundState) => {
      return prevState.holeScores.map((existingScore: number, i: number) => {
        if (i in NON_HOLE_ROWS) {
          // return totals here
          return 100;
        }
        if (i == Number(row.hole) - 1) return newValue as number;
        return existingScore;
      });
    };
    roundContext.dispatch({
      type: "update hole score",
      payload: {
        ...roundContext.state,
        holeScores: updatedHoleScoresContext(roundContext.state),
      },
    });
  };

  function handleDistanceToPin(event: Event, newValue: number | number[]) {
    let holeShotDetailsCopy = roundContext.state.holeShotDetails;
    const updateStateTest = (prevState: IShotDetail[][]) => {
      return holeShotDetailsCopy.map((existingScore: IShotDetail[], i: number) => {
        if (i == Number(row.hole)) {
          // testing with hardcoded value
          console.log(`operating on ${row.hole}`);
          return [
            {
              shotNumber: 1,
              distanceToPin: 150,
              club: "8 iron",
              result: "on green",
            },
          ];
        }
        return existingScore;
      });
    };
    roundContext.dispatch({
      type: "update hole shot details",
      payload: {
        ...roundContext.state,
        holeShotDetails: updateStateTest(holeShotDetailsCopy),
      },
    });
  }
  console.log("row");
  console.log(row);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        edit shot details
      </Button>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle textAlign="center">Hole Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Shot number</DialogContentText>
          <Slider
            aria-label="Shot number"
            defaultValue={1}
            getAriaValueText={valuetext}
            step={1}
            min={1}
            max={10}
            valueLabelDisplay="on"
            value={shotNumber}
            onChange={handleShotNumberChange}
          />
          <DialogContentText>Distance</DialogContentText>
          <Slider
            aria-label="Yards to pin"
            defaultValue={1}
            getAriaValueText={valuetext}
            step={5}
            min={5}
            max={350}
            valueLabelDisplay="on"
            onChange={handleDistanceToPin}
          />
          <Box>
            <InputLabel id="demo-simple-select-label">Club</InputLabel>
            <Select
              autoWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={10}
              label="Club"
              onChange={() => "hi"}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
            <InputLabel id="demo-simple-select-label">Result</InputLabel>
            <Select
              autoWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={10}
              label="Result"
              onChange={() => "hi"}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
