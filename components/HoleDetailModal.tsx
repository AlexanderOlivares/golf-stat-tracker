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

  const [open, setOpen] = React.useState(false);
  const [shotNumber, setShotNumber] = React.useState(1); // is this needed?
  const [dtp, setDtp] = React.useState(Number(row.yardage) || 35); // is this needed?
  const [localHoleDetails, setLocalHoleDetails] = useState<IShotDetail>({
    shotNumber: shotNumber,
    distanceToPin: Number(row.yardage),
    club: null,
    result: null,
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addNewHoleDetailsEntries = (prevState: IRoundState) => {
    const prevStateCopy = { ...prevState };

    const holeIndexToUpdate = Number(row.hole) < 9 ? Number(row.hole) - 1 : Number(row.hole);

    const updatedHoleShotDetails = prevStateCopy.holeShotDetails.map(
      (holeDetail: IShotDetail[], index: number) => {
        if (index != holeIndexToUpdate) return holeDetail;
        const entryForThisShotNumberExists = holeDetail.find(
          shot => shot.shotNumber == localHoleDetails.shotNumber
        );
        if (!entryForThisShotNumberExists) {
          return [...holeDetail, localHoleDetails];
        }
        return holeDetail.map((shot: IShotDetail, i: number) => {
          if (shot.shotNumber != localHoleDetails.shotNumber) return shot;
          return localHoleDetails;
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

  const updatedHoleScoresContext = (prevState: IRoundState) => {
    const updatedScores = prevState.holeScores.map((existingScore: number, i: number) => {
      if (i in NON_HOLE_ROWS) {
        // TODO return totals here
        return 100;
      }
      if (i == Number(row.hole) - 1) return shotNumber;
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
    setLocalHoleDetails((prev: IShotDetail) => {
      return {
        ...prev,
        shotNumber: newValue as number,
      };
    });
  };

  function handleDistanceToPin(event: Event, newValue: number | number[]) {
    setLocalHoleDetails((prev: IShotDetail) => {
      return {
        ...prev,
        distanceToPin: newValue as number,
      };
    });
  }

  const handleClubChange = (event: SelectChangeEvent) => {
    setLocalHoleDetails((prev: IShotDetail) => {
      return {
        ...prev,
        club: event.target.value as string,
      };
    });
  };

  const handleShotResultChange = (event: SelectChangeEvent) => {
    setLocalHoleDetails((prev: IShotDetail) => {
      return {
        ...prev,
        result: event.target.value as string,
      };
    });
  };

  useEffect(() => {
    addNewHoleDetailsEntries(roundContext.state);
    updatedHoleScoresContext(roundContext.state);
  }, [localHoleDetails]);

  console.log("------- local state ---------");
  console.log(localHoleDetails);

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
            defaultValue={localHoleDetails.distanceToPin || dtp}
            value={localHoleDetails.distanceToPin || dtp}
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
              value={localHoleDetails.club || roundContext.state.clubs[0]}
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
              value={localHoleDetails.result || shotResultOptions[0]}
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
