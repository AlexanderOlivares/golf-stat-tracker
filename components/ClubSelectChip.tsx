import React, { useState } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const clubs = [
  "Driver",
  "3 wood",
  "4 hybrid",
  "4 iron",
  "5 iron",
  "6 iron",
  "7 iron",
  "8 iron",
  "9 iron",
  "Pitching Wedge",
  "52 degree",
  "56 degree",
  "58 degree",
  "60 degree",
  "putter",
  "3 hybrid",
  "7 wood",
  "5 wood",
  "1 iron",
  "2 iron",
  "3 iron",
  "50 degree",
  "54 degree",
  "62 degree",
  "64 degree",
];

function getStyles(name: string, clubName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      clubName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip() {
  const theme = useTheme();

  // useQuery to pull saved bag from db
  const [clubsInBag, setClubsInBag] = useState<string[]>(clubs.slice(0, 13));

  const handleChange = (event: SelectChangeEvent<typeof clubsInBag>) => {
    const {
      target: { value },
    } = event;
    setClubsInBag(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  console.log(clubsInBag);

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="club-selection">Clubs</InputLabel>
        <Select
          labelId="select-clubs"
          id="club-selection-chip"
          multiple
          value={clubsInBag}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Club" />}
          renderValue={selected => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map(value => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {clubs.map(name => (
            <MenuItem key={name} value={name} style={getStyles(name, clubsInBag, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
