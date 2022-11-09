import React, { useEffect, useState } from "react";
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
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { IShotDetail } from "../utils/roundFormatter";
import { ICompleteScoreCard } from "../components/ScoreCard";
import { useRoundContext } from "../context/RoundContext";
import { IRoundState } from "../context/RoundContext";
import { NON_HOLE_ROWS } from "../utils/scoreCardFormatter";
import { shotResultOptions } from "../lib/selectOptions";

function valuetext(value: number) {
  return `${value}`;
}

export function HoleDetailModal({ row }: { row: ICompleteScoreCard }) {
  const roundContext = useRoundContext();
  const holeIndex = Number(row.hole) <= 9 ? Number(row.hole) - 1 : Number(row.hole);

  const [open, setOpen] = useState(false);
  const [shotNumber, setShotNumber] = useState(roundContext.state.holeScores[holeIndex] || 1);
  const holeTotalYardage = Number(row.yardage);
  const lastDTPIndex = roundContext.state.holeShotDetails[holeIndex].length - 1;
  const [dtp, setDtp] = useState(
    roundContext.state.holeShotDetails[holeIndex][lastDTPIndex]["distanceToPin"] || holeTotalYardage
  );

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addNewHoleDetailsEntries = (
    prevState: IRoundState,
    keyToUpdate: keyof IShotDetail,
    valueToUpdate: string | number
  ) => {
    const prevStateCopy = { ...prevState };

    const holeIndexToUpdate = Number(row.hole) < 9 ? Number(row.hole) - 1 : Number(row.hole);

    const updatedHoleShotDetails = prevStateCopy.holeShotDetails.map(
      (holeDetail: IShotDetail[], index: number) => {
        if (index != holeIndexToUpdate) return holeDetail;
        const entryForShotNumberExists = holeDetail.find(shot => shot.shotNumber == shotNumber);
        const newEntry: IShotDetail = {
          shotNumber,
          distanceToPin: dtp,
          club: null,
          result: null,
        };
        if (!entryForShotNumberExists) {
          return [...holeDetail, newEntry];
        }
        return holeDetail.map((shot: IShotDetail) => {
          if (shot.shotNumber != shotNumber) return shot;
          return {
            ...shot,
            shotNumber,
            [keyToUpdate]: valueToUpdate != "--" ? valueToUpdate : null,
          };
        });
      }
    );

    roundContext.dispatch({
      type: "update hole shot details",
      payload: {
        ...roundContext.state,
        holeShotDetails: updatedHoleShotDetails,
      },
    });
  };

  function sliceSum(arr: number[], start: number, end: number) {
    return arr.slice(start, end).reduce((a, c) => a + c, 0);
  }

  const updatedHoleScoresContext = (prevState: IRoundState) => {
    const updatedScores = prevState.holeScores.map((existingScore: number, i: number) => {
      if (NON_HOLE_ROWS[i] == "out") {
        return sliceSum(prevState.holeScores, 0, 9);
      }
      if (NON_HOLE_ROWS[i] == "in") {
        return sliceSum(prevState.holeScores, 10, 19);
      }
      if (i in NON_HOLE_ROWS) {
        if (NON_HOLE_ROWS[i] == "total") {
          const frontNine = sliceSum(prevState.holeScores, 0, 9);
          const backNine = sliceSum(prevState.holeScores, 10, 19);
          return frontNine + backNine;
        }
      }
      if (i == holeIndex) return shotNumber;
      return existingScore;
    });
    roundContext.dispatch({
      type: "update hole score",
      payload: {
        ...roundContext.state,
        holeScores: updatedScores,
      },
    });
  };

  const handleShotNumberChange = (_: Event, newValue: number | number[]) => {
    setShotNumber(newValue as number);
    updatedHoleScoresContext(roundContext.state);
  };

  function handleDistanceToPin(event: Event, newValue: number | number[]) {
    setDtp(newValue as number);
    addNewHoleDetailsEntries(roundContext.state, "distanceToPin", newValue as number);
  }

  const handleClubChange = (event: SelectChangeEvent) => {
    addNewHoleDetailsEntries(roundContext.state, "club", event.target.value);
  };

  const handleShotResultChange = (event: SelectChangeEvent) => {
    addNewHoleDetailsEntries(roundContext.state, "result", event.target.value);
  };

  useEffect(() => {
    updatedHoleScoresContext(roundContext.state);
  }, [shotNumber, open]);

  useEffect(() => {
    addNewHoleDetailsEntries(roundContext.state, "distanceToPin", dtp);
  }, []);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        edit shot details
      </Button>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle textAlign="center">My Score {shotNumber}</DialogTitle>
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
          <DialogTitle textAlign="center">Hole Details</DialogTitle>
          <DialogContentText>Distance To Pin</DialogContentText>
          <Slider
            aria-label="Yards to pin"
            key={row.score}
            value={
              roundContext.state.holeShotDetails[holeIndex][shotNumber - 1]?.distanceToPin || dtp
            }
            getAriaValueText={valuetext}
            step={5}
            min={5}
            max={holeTotalYardage || dtp} // dtp as fallback could be problematic
            valueLabelDisplay="on"
            onChange={handleDistanceToPin}
          />
          <Box>
            <InputLabel id="demo-simple-select-label">Club</InputLabel>
            <Select
              autoWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              defaultValue="--"
              value={roundContext.state.holeShotDetails[holeIndex][shotNumber - 1]?.club || "--"}
              label="Club"
              onChange={handleClubChange}
            >
              {roundContext.state.clubs.map((club: string) => {
                return (
                  <MenuItem key={club} value={club}>
                    {club}
                  </MenuItem>
                );
              })}
            </Select>
            <InputLabel id="demo-simple-select-label">Result</InputLabel>
            <Select
              autoWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={roundContext.state.holeShotDetails[holeIndex][shotNumber - 1]?.result || "--"}
              label="Result"
              onChange={handleShotResultChange}
            >
              {shotResultOptions.map((option: string) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
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
