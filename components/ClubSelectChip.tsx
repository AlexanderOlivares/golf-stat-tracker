import React, { useState, useEffect } from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useQuery } from "@apollo/client";
import { queryParamToString } from "../utils/queryParamFormatter";
import { useRouter } from "next/router";
import { getUserClubsQuery } from "../pages/api/graphql/queries/clubQueries";
import { Button } from "@mui/material";
import { useMutation } from "@apollo/client";
import { clubEditMutation } from "../pages/api/graphql/mutations/clubMutations";
import { defaultClubs } from "../lib/selectOptions";
import { toast } from "react-toastify";
import { parseErrorMessage } from "../utils/errorMessage";

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
  const [editClubs] = useMutation(clubEditMutation);
  const theme = useTheme();
  const router = useRouter();
  const { username } = router.query;

  const [clubsInBag, setClubsInBag] = useState<string[]>(defaultClubs);

  const handleChange = (event: SelectChangeEvent<typeof clubsInBag>) => {
    const {
      target: { value },
    } = event;
    setClubsInBag(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const { error, loading, data } = useQuery(getUserClubsQuery, {
    variables: {
      username: queryParamToString(username),
    },
    fetchPolicy: "network-only",
  });

  async function saveClubs() {
    try {
      if (!clubsInBag.length || !clubsInBag.includes("Putter")) {
        toast.error("You must have a putter");
        setClubsInBag([...clubsInBag, "Putter"]);
        return;
      }
      const savedEditedClubs = await editClubs({
        variables: {
          clubs: clubsInBag,
          username,
        },
      });
      const { clubs } = savedEditedClubs.data.editClubs;
      if (clubs) setClubsInBag(clubs);
      toast.success("Clubs saved");
    } catch (error) {
      console.log(error);
      toast.error(parseErrorMessage(error));
    }
  }

  if (error) {
    toast.error(parseErrorMessage(error));
    router.push("/login");
  }

  useEffect(() => {
    if (data) {
      setClubsInBag(data.clubs.clubs);
    }
  }, [data]);

  return (
    <>
      {loading ? (
        <div>loading...</div>
      ) : (
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
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
            <Button variant="contained" onClick={saveClubs}>
              Save
            </Button>
          </FormControl>
        </div>
      )}
    </>
  );
}
