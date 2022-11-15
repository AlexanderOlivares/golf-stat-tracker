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
import { getHoleIndexToUpdate, ICompleteScoreCard } from "../components/ScoreCard";
import { useRoundContext } from "../context/RoundContext";
import { IRoundState } from "../context/RoundContext";
import { NON_HOLE_ROWS } from "../utils/scoreCardFormatter";
import { shotResultOptions } from "../lib/selectOptions";
import {
  calculateFairwaysHit,
  calculateGreensInReg,
  calculateTotalPutts,
  getNonParThreeIndices,
} from "../utils/holeDetailsFormatter";

function valuetext(value: number) {
  return `${value}`;
}

export function HoleDetailModal({ row }: { row: ICompleteScoreCard }) {
  const roundContext = useRoundContext();
  const holeIndex = getHoleIndexToUpdate(row.hole);

  const [open, setOpen] = useState(false);
  const [shotNumber, setShotNumber] = useState(roundContext.state.holeScores[holeIndex] || 1);
  const holeTotalYardage = Number(row.yardage);
  const lastDTPIndex = roundContext.state.holeShotDetails[holeIndex].length - 1;
  const [dtp, setDtp] = useState(
    roundContext.state.holeShotDetails[holeIndex][lastDTPIndex]["distanceToPin"] || holeTotalYardage
  );
  const [yardsOrFeet, setYardsOrFeet] = useState<string>("Yards");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function getFairwaysHit(frontOrBackNine?: string) {
    const frontNineFairwayIndices = getNonParThreeIndices(roundContext.state.par, 0, 9);
    const backNineFairwayIndices = getNonParThreeIndices(roundContext.state.par, 10, 19);
    const totalFairways = roundContext.state.par.filter(par => Number(par) > 3).length - 2; // minus in/out total par
    const frontFairwaysHit = calculateFairwaysHit(
      roundContext.state.holeShotDetails,
      frontNineFairwayIndices
    );
    const backFairwaysHit = calculateFairwaysHit(
      roundContext.state.holeShotDetails,
      backNineFairwayIndices
    );
    if (frontOrBackNine == "front") return `${frontFairwaysHit}/${frontNineFairwayIndices.length}`;
    if (frontOrBackNine == "back") return `${backFairwaysHit}/${backNineFairwayIndices.length}`;
    return `${frontFairwaysHit + backFairwaysHit}/${totalFairways}`;
  }

  function getGreensInReg(frontOrBack?: string) {
    const { holeShotDetails, par } = roundContext.state;
    if (frontOrBack == "front") return calculateGreensInReg(holeShotDetails, par, 0, 9);
    if (frontOrBack == "back") return calculateGreensInReg(holeShotDetails, par, 10, 19);
    return calculateGreensInReg(holeShotDetails, par);
  }

  function getTotalPutts(frontBackOrTotal?: string) {
    const { holeShotDetails } = roundContext.state;
    const sum = (arr: number[]) => arr.reduce((a, c) => a + c, 0);
    if (frontBackOrTotal == "front") {
      const frontNinePutts = calculateTotalPutts(holeShotDetails, 0, 9);
      return sum(frontNinePutts);
    }
    if (frontBackOrTotal == "back") {
      const backNinePutts = calculateTotalPutts(holeShotDetails, 10, 19);
      return sum(backNinePutts);
    }
    const totalPutts = calculateTotalPutts(holeShotDetails);
    return sum(totalPutts);
  }

  function getThreePutts(frontBackOrTotal?: string) {
    const { holeShotDetails } = roundContext.state;
    const getThreePutts = (arr: number[]) => arr.filter(putts => putts > 2).length;
    if (frontBackOrTotal == "front") {
      const frontNinePutts = calculateTotalPutts(holeShotDetails, 0, 9);
      return getThreePutts(frontNinePutts);
    }
    if (frontBackOrTotal == "back") {
      const backNinePutts = calculateTotalPutts(holeShotDetails, 10, 19);
      return getThreePutts(backNinePutts);
    }
    const totalPutts = calculateTotalPutts(holeShotDetails);
    return getThreePutts(totalPutts);
  }

  const addNewHoleDetailsEntries = (
    prevState: IRoundState,
    keyToUpdate: keyof IShotDetail,
    valueToUpdate: string | number
  ) => {
    const updatedHoleShotDetails = prevState.holeShotDetails.map(
      (holeDetail: IShotDetail[], index: number) => {
        if (index != holeIndex) return holeDetail;
        const entryForShotNumberExists = holeDetail.find(shot => shot.shotNumber == shotNumber);
        const newEntry: IShotDetail = {
          shotNumber,
          distanceToPin: dtp,
          club: null,
          result: null,
          [keyToUpdate]: valueToUpdate != "--" ? valueToUpdate : null,
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
    if (event.target.value == "Putter") setYardsOrFeet("Feet");
    addNewHoleDetailsEntries(roundContext.state, "club", event.target.value);
  };

  const handleShotResultChange = (event: SelectChangeEvent) => {
    addNewHoleDetailsEntries(roundContext.state, "result", event.target.value);
  };

  function saveScorecard() {
    updatedHoleScoresContext(roundContext.state);
    if (roundContext.state.holeShotDetails[holeIndex][shotNumber - 1]?.club != "Putter") {
      setYardsOrFeet("Yards");
    } else {
      setYardsOrFeet("Feet");
    }

    const updatedHoleShotDetails = roundContext.state.holeShotDetails.map(
      (holeDetail: IShotDetail[], index: number) => {
        if (index === 9) {
          return [
            {
              fairwaysHit: getFairwaysHit("front"),
              greensInReg: getGreensInReg("front"),
              threePutts: getThreePutts("front"),
              totalPutts: getTotalPutts("front"),
            },
          ];
        }
        if (index === 19) {
          return [
            {
              fairwaysHit: getFairwaysHit("back"),
              greensInReg: getGreensInReg("back"),
              threePutts: getThreePutts("back"),
              totalPutts: getTotalPutts("back"),
            },
          ];
        }
        if (index === 20) {
          return [
            {
              fairwaysHit: getFairwaysHit(),
              greensInReg: getGreensInReg(),
              threePutts: getThreePutts(),
              totalPutts: getTotalPutts(),
            },
          ];
        }
        return holeDetail;
      }
    );

    roundContext.dispatch({
      type: "update hole shot details",
      payload: {
        ...roundContext.state,
        holeShotDetails: updatedHoleShotDetails,
      },
    });
  }

  useEffect(() => {
    saveScorecard();
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
          <DialogContentText>{`Distance To Pin ${yardsOrFeet}`}</DialogContentText>
          <Slider
            aria-label="Distance to pin"
            key={row.score}
            value={
              roundContext.state.holeShotDetails[holeIndex][shotNumber - 1]?.distanceToPin || dtp
            }
            getAriaValueText={valuetext}
            step={yardsOrFeet === "Yards" ? 5 : 1}
            min={yardsOrFeet === "Yards" ? 5 : 1}
            max={yardsOrFeet === "Yards" ? holeTotalYardage || dtp : 100} // dtp as fallback could be problematic
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
