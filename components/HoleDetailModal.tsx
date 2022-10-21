import * as React from "react";
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

const marks = [
  {
    value: 1,
    label: "1",
  },
  {
    value: 2,
    label: "2",
  },
  {
    value: 3,
    label: "3",
  },
  {
    value: 4,
    label: "4",
  },
];

function valuetext(value: number) {
  return `${value}`;
}

interface IHoleDetailModalProps {
  row: ICompleteScoreCard;
}

export function HoleDetailModal({ row }: { row: ICompleteScoreCard }) {
  const [open, setOpen] = React.useState(false);
  const [holeNumber, setHoleNumber] = React.useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleHoleChange = (event: Event, newValue: number | number[]) => {
    setHoleNumber(newValue as number);
  };
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
            value={holeNumber}
            onChange={handleHoleChange}
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
