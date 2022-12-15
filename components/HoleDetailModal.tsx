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
import { useRoundContext, IRoundState } from "../context/RoundContext";
import { NON_HOLE_ROWS } from "../utils/scoreCardFormatter";
import { shotResultOptions } from "../lib/selectOptions";
import {
  calculateFairwaysHit,
  calculateGreensInReg,
  calculateTotalPutts,
  getNonParThreeIndices,
} from "../utils/holeDetailsFormatter";
import { useMutation } from "@apollo/client";
import { saveRound as saveRoundMutation } from "../pages/api/graphql/mutations/roundMutations";
import { useRouter } from "next/router";
import { queryParamToString } from "../utils/queryParamFormatter";
import { saveUnverifiedCourseParMutation } from "../pages/api/graphql/mutations/unverifiedCourseMutations";
import { useNetworkContext } from "../context/NetworkContext";

function valuetext(value: number) {
  return `${value}`;
}

export function HoleDetailModal({ row }: { row: ICompleteScoreCard }) {
  const router = useRouter();
  const { roundid, unverifiedCourseId } = router.query;
  const [saveRound] = useMutation(saveRoundMutation);
  const [saveUnverifiedCoursePar] = useMutation(saveUnverifiedCourseParMutation);
  const roundContext = useRoundContext();
  const networkContext = useNetworkContext();
  const holeIndex = getHoleIndexToUpdate(row.hole);

  const [open, setOpen] = useState(false);
  const [shotNumber, setShotNumber] = useState(roundContext.state.holeScores[holeIndex] || 1);
  const holeTotalYardage = Number(row.yardage || 400);
  const [shotDetailIndexToUpdate, setShotDetailIndexToUpdate] = useState(shotNumber - 1);
  const [dtp, setDtp] = useState(
    roundContext.state.holeShotDetails[holeIndex][shotDetailIndexToUpdate]?.distanceToPin ||
      holeTotalYardage
  );
  const [yardsOrFeet, setYardsOrFeet] = useState<string>("Yards");
  const [userAddedPar, setUserAddedPar] = useState<string>(roundContext.state.par[holeIndex] || "");

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function getFairwaysHit(frontOrBackNine?: string) {
    const frontNineFairwayIndices = getNonParThreeIndices(roundContext.state.par, 0, 9);
    const backNineFairwayIndices = getNonParThreeIndices(roundContext.state.par, 10, 19);
    const totalFairways = frontNineFairwayIndices.length + backNineFairwayIndices.length;
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
    return updatedScores;
  };

  const handleShotNumberChange = (_: Event, newValue: number | number[]) => {
    setShotNumber(newValue as number);
    updatedHoleScoresContext(roundContext.state);
  };

  const handleUserAddedParChange = async (_: Event, newValue: number | number[]) => {
    const parString = newValue.toString();
    setUserAddedPar(parString);
  };

  function handleDistanceToPin(_: Event, newValue: number | number[]) {
    setDtp(newValue as number);
    addNewHoleDetailsEntries(roundContext.state, "distanceToPin", newValue as number);
  }

  const handleClubChange = (event: SelectChangeEvent) => {
    const club = event.target.value;
    club == "Putter" ? setYardsOrFeet("Feet") : setYardsOrFeet("Yards");
    addNewHoleDetailsEntries(roundContext.state, "club", club);
  };

  const handleShotResultChange = (event: SelectChangeEvent) => {
    addNewHoleDetailsEntries(roundContext.state, "result", event.target.value);
  };

  function getSelectIndexFromShotNumber(holeShotDetails: IShotDetail[], shotNumber: number) {
    const indexOfShotNumber = holeShotDetails.findIndex(shot => shot.shotNumber === shotNumber);
    const targetIndex = indexOfShotNumber == -1 ? holeShotDetails.length : indexOfShotNumber;
    if (roundContext.state.holeShotDetails[holeIndex][targetIndex]?.club != "Putter") {
      setYardsOrFeet("Yards");
    } else {
      setYardsOrFeet("Feet");
    }
    setShotDetailIndexToUpdate(targetIndex);
  }

  function handleHoleReset() {
    const shotDetailsWithResetHole = roundContext.state.holeShotDetails.map(
      (hole: IShotDetail[], index: number) => {
        if (index != holeIndex) return hole;
        return [
          {
            shotNumber: 1,
            distanceToPin: null,
            club: null,
            result: null,
          },
        ];
      }
    );

    roundContext.state.holeScores[holeIndex] = 1;
    setShotNumber(1);
    addNewHoleDetailsEntries(roundContext.state, "distanceToPin", holeTotalYardage);

    roundContext.dispatch({
      type: "update scores and shot details",
      payload: {
        ...roundContext.state,
        holeScores: roundContext.state.holeScores,
        holeShotDetails: shotDetailsWithResetHole,
      },
    });
  }

  async function saveScorecard() {
    try {
      const updatedHoleScores = updatedHoleScoresContext(roundContext.state);

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

      const { hasNetworkConnection, offlineModeEnabled } = networkContext.state;

      if (!offlineModeEnabled && hasNetworkConnection) {
        // save to db if online
        const { data } = await saveRound({
          variables: {
            holeScores: updatedHoleScores,
            holeShotDetails: updatedHoleShotDetails,
            roundid: queryParamToString(roundid),
          },
        });

        const {
          hole_scores: dbHoleScores,
          hole_shot_details: dbHoleShotDetails,
        }: { hole_scores: number[]; hole_shot_details: IShotDetail[][] } = data.saveRound;

        roundContext.dispatch({
          type: "update scores and shot details and timestamp",
          payload: {
            ...roundContext.state,
            lastSaveTimestamp: Date.now(),
            holeScores: dbHoleScores,
            holeShotDetails: dbHoleShotDetails,
          },
        });
        console.log("++++++++++ SAVED TO POSTGRES ++++++++++");
      } else {
        roundContext.dispatch({
          type: "update scores and shot details and timestamp",
          payload: {
            ...roundContext.state,
            holeScores: updatedHoleScores,
            holeShotDetails: updatedHoleShotDetails,
          },
        });
        console.log("---------- SAVED TO INDEXEDB ----------");
      }
    } catch (error) {
      // TODO add toast error
      console.log(error);
    }
  }

  async function saveUnverifiedPar() {
    const updatedUserAddedPar = roundContext.state.par.map((par: string, i: number) => {
      if (holeIndex != i) return par;
      return userAddedPar || "4";
    });

    const { hasNetworkConnection, offlineModeEnabled } = networkContext.state;

    if (hasNetworkConnection && !offlineModeEnabled) {
      const { data } = await saveUnverifiedCoursePar({
        variables: {
          userAddedPar: updatedUserAddedPar,
          unverifiedCourseId,
        },
      });

      const dbUserAddedPar = data.saveUnverifiedCoursePar.user_added_par;

      roundContext.dispatch({
        type: "set par for user added course",
        payload: {
          ...roundContext.state,
          par: dbUserAddedPar,
        },
      });
    } else {
      roundContext.dispatch({
        type: "set par for user added course",
        payload: {
          ...roundContext.state,
          par: updatedUserAddedPar,
        },
      });
    }
  }

  useEffect(() => {
    getSelectIndexFromShotNumber(roundContext.state.holeShotDetails[holeIndex], shotNumber);
    saveScorecard();
  }, [shotNumber, open]);

  useEffect(() => {
    if (roundContext.state.isUserAddedCourse) {
      saveUnverifiedPar();
    }
  }, [userAddedPar, open]);

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
          {roundContext.state.isUserAddedCourse && (
            <>
              <DialogContentText>Par</DialogContentText>
              <Slider
                aria-label="Par"
                defaultValue={3}
                getAriaValueText={valuetext}
                step={1}
                min={3}
                max={5}
                valueLabelDisplay="on"
                value={Number(roundContext.state.par[holeIndex])}
                onChange={handleUserAddedParChange}
              />
            </>
          )}
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
              roundContext.state.holeShotDetails[holeIndex][shotDetailIndexToUpdate]
                ?.distanceToPin || dtp
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
              value={
                roundContext.state.holeShotDetails[holeIndex][shotDetailIndexToUpdate]?.club || "--"
              }
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
              value={
                roundContext.state.holeShotDetails[holeIndex][shotDetailIndexToUpdate]?.result ||
                "--"
              }
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
          <Button onClick={handleHoleReset}>Reset</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
