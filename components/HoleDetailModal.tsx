import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
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
import { shotResultOptions } from "../lib/selectOptions";
import {
  getScoreCountByName,
  updatedHoleScoresContext,
  updateStatTotals,
} from "../utils/holeDetailsFormatter";
import { useMutation } from "@apollo/client";
import { saveRound as saveRoundMutation } from "../pages/api/graphql/mutations/roundMutations";
import { useRouter } from "next/router";
import { queryParamToString } from "../utils/queryParamFormatter";
import { saveUnverifiedCourseParMutation } from "../pages/api/graphql/mutations/unverifiedCourseMutations";
import { useNetworkContext } from "../context/NetworkContext";
import { useAuthContext } from "../context/AuthContext";
import { parseErrorMessage } from "../utils/errorMessage";
import { toast } from "react-toastify";
import * as Sentry from "@sentry/nextjs";

function valuetext(value: number) {
  return `${value}`;
}

export function HoleDetailModal({ row }: { row: ICompleteScoreCard }) {
  const router = useRouter();
  const { roundid, unverifiedCourseId, username } = router.query;
  const [saveRound] = useMutation(saveRoundMutation);
  const [saveUnverifiedCoursePar] = useMutation(saveUnverifiedCourseParMutation);
  const roundContext = useRoundContext();
  const networkContext = useNetworkContext();
  const authContext = useAuthContext();
  const { isAuth, tokenPayload } = authContext.state;
  const usernameIsAuthorized = isAuth && tokenPayload?.username == username;

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

    if (usernameIsAuthorized) {
      roundContext.dispatch({
        type: "update hole shot details",
        payload: {
          ...roundContext.state,
          holeShotDetails: updatedHoleShotDetails,
        },
      });
    }
  };

  const handleShotNumberChange = (_: Event, newValue: number | number[]) => {
    setShotNumber(newValue as number);
    updatedHoleScoresContext(roundContext.state, holeIndex, newValue as number);
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

    if (usernameIsAuthorized) {
      roundContext.dispatch({
        type: "update scores and shot details and timestamp",
        payload: {
          ...roundContext.state,
          holeScores: roundContext.state.holeScores,
          holeShotDetails: shotDetailsWithResetHole,
        },
      });
    }
  }

  async function saveScorecard() {
    try {
      const updatedHoleScores = updatedHoleScoresContext(roundContext.state, holeIndex, shotNumber);
      const { par, holeScores } = roundContext.state;
      const updatedScoreCountByName = getScoreCountByName(holeScores, par);
      const updatedHoleShotDetails = updateStatTotals(roundContext);

      const { hasNetworkConnection, offlineModeEnabled } = networkContext.state;

      if (!offlineModeEnabled && hasNetworkConnection) {
        // save to db if online
        const { data } = await saveRound({
          variables: {
            holeScores: updatedHoleScores,
            holeShotDetails: updatedHoleShotDetails,
            scoreCountByName: updatedScoreCountByName,
            roundid: queryParamToString(roundid),
            username: queryParamToString(username),
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
            scoreCount: updatedScoreCountByName,
          },
        });
        console.log("++++++++++ SAVED TO POSTGRES ++++++++++");
      } else {
        if (usernameIsAuthorized) {
          roundContext.dispatch({
            type: "update scores and shot details and timestamp",
            payload: {
              ...roundContext.state,
              holeScores: updatedHoleScores,
              holeShotDetails: updatedHoleShotDetails,
              scoreCount: updatedScoreCountByName,
            },
          });
          console.log("---------- SAVED TO INDEXEDB ----------");
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
      return router.push("/login");
    }
  }

  async function saveUnverifiedPar() {
    try {
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
            username: queryParamToString(username),
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
        if (usernameIsAuthorized) {
          roundContext.dispatch({
            type: "set par for user added course",
            payload: {
              ...roundContext.state,
              par: updatedUserAddedPar,
            },
          });
        }
      }
    } catch (error) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
      return router.push("/login");
    }
  }

  useEffect(() => {
    getSelectIndexFromShotNumber(roundContext.state.holeShotDetails[holeIndex], shotNumber);
    addNewHoleDetailsEntries(roundContext.state, "distanceToPin", dtp);
    if (roundContext.state.holeShotDetails[holeIndex][0].distanceToPin) saveScorecard();
  }, [shotNumber, open]);

  useEffect(() => {
    if (roundContext.state.isUserAddedCourse) {
      saveUnverifiedPar();
    }
  }, [userAddedPar, open]);

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        edit shot details
      </Button>
      <Dialog fullWidth={true} open={open} onClose={handleClose}>
        <DialogTitle textAlign="center">Hole Score: {shotNumber}</DialogTitle>
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
          <DialogContentText pb={4}>Shot Number</DialogContentText>
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
          <DialogContentText pb={5}>{`Distance To Pin in ${yardsOrFeet}`}</DialogContentText>
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
          <Box textAlign="center">
            <Box mb={2}>
              <InputLabel id="demo-simple-select-label">Club</InputLabel>
              <Select
                sx={{ minWidth: "75%" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                defaultValue="--"
                value={
                  roundContext.state.holeShotDetails[holeIndex][shotDetailIndexToUpdate]?.club ||
                  "--"
                }
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
            </Box>
            <Box>
              <InputLabel id="demo-simple-select-label">Result</InputLabel>
              <Select
                sx={{ minWidth: "75%" }}
                autoWidth
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={
                  roundContext.state.holeShotDetails[holeIndex][shotDetailIndexToUpdate]?.result ||
                  "--"
                }
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
          </Box>
        </DialogContent>
        <Box display="flex" justifyContent="space-around" pb={3}>
          <DialogActions>
            <Box mr={4}>
              <Button variant="contained" size="large" color="error" onClick={handleHoleReset}>
                Reset
              </Button>
            </Box>
            <Button variant="contained" size="large" onClick={handleClose}>
              Save
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
