import React, { useState, useContext, useEffect } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { defaultClubs, UserProfileContext } from "../pages/[username]/edit-profile";

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
  const { clubs } = useContext(UserProfileContext);

  // useQuery to pull saved bag from db
  //   const [clubsInBag, setClubsInBag] = useState<string[]>(defaultClubs.slice(0, 13));
  const [clubsInBag, setClubsInBag] = useState<string[]>([""]);

  const handleChange = (event: SelectChangeEvent<typeof clubsInBag>) => {
    const {
      target: { value },
    } = event;
    setClubsInBag(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    setClubsInBag(clubs);
  }, [clubs]);
  //   console.log(clubsInBag);

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
          {defaultClubs.map(name => (
            <MenuItem key={name} value={name} style={getStyles(name, clubsInBag, theme)}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
