import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/router";
import { Typography, Box, Button } from "@mui/material";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import { getAuthTokenQuery } from "../pages/api/graphql/queries/authQueries";
import { useLazyQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function NewRoundModal() {
  const router = useRouter();
  const [verifyAuth, lazyResults] = useLazyQuery(getAuthTokenQuery);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [holeCount, setHoleCount] = React.useState("18");
  const [roundView, setRoundView] = React.useState("hole-by-hole");

  const handleHoleCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHoleCount(event.target.value);
  };

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoundView(event.target.value);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();

      const { data, error } = await verifyAuth();

      // TODO add toast error
      if (error) router.push("/login");

      const { username } = data.token;
      const roundid = uuidv4();

      router.push(`/${username}/round/${roundid}`);
    } catch (error) {
      // TODO add toast error or remove
      console.log(error);
    }
  }

  return (
    <div>
      <Button onClick={handleOpen} size="medium" variant="contained" color="primary">
        new round
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Round
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <Box>
              <FormControl>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Holes
                </Typography>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={holeCount}
                  onChange={handleHoleCountChange}
                >
                  <span>
                    <FormControlLabel value="9" control={<Radio />} label="9" />
                    <FormControlLabel value="18" control={<Radio />} label="18" />
                  </span>
                </RadioGroup>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Select View
                </Typography>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={roundView}
                  onChange={handleViewChange}
                >
                  <FormControlLabel value="scorecard" control={<Radio />} label="scorecard view" />
                  <FormControlLabel
                    value="hole-by-hole"
                    control={<Radio />}
                    label="hole-by-hole view"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Button type="submit" size="small" variant="contained" color="primary">
              start round
            </Button>
            <Button onClick={handleClose} size="small" variant="contained" color="primary">
              cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
