import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

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
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Select View
          </Typography>
          <Button size="medium" variant="contained" color="primary">
            full card view
          </Button>
          <Button size="medium" variant="contained" color="primary">
            hole-by-hole view
          </Button>
          <Button onClick={handleClose} size="small" variant="contained" color="primary">
            cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
