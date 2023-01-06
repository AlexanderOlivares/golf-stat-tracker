import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DeleteForeverOutlined from "@mui/icons-material/DeleteForeverOutlined";
import { Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import { deleteRoundMutation } from "../pages/api/graphql/mutations/roundMutations";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import LoadingSpinner from "./LoadingSpinner";
import { parseErrorMessage } from "../utils/errorMessage";
import { queryParamToString } from "../utils/queryParamFormatter";

export interface ConfirmationDialogRawProps {
  id: string;
  keepMounted: boolean;
  value: string;
  open: boolean;
  onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, open } = props;
  const [deleteRound] = useMutation(deleteRoundMutation);
  const router = useRouter();
  const { username, roundid } = router.query;
  console.log(username, roundid);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    try {
      const { data } = await deleteRound({
        variables: {
          roundid: queryParamToString(roundid),
          username: queryParamToString(username),
        },
      });

      if (data) {
        toast.success("Round was deleted.");
        router.push(`/${username}/profile`);
        onClose();
      }
    } catch (error) {
      toast.error(parseErrorMessage(error));
    }
  };

  return (
    <Dialog
      sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435, paddingBottom: "15px" } }}
      maxWidth="xs"
      open={open}
    >
      <DialogTitle textAlign="center">Delete This Round?</DialogTitle>
      <Box textAlign="center" display="flex" justifyContent="space-evenly">
        <DialogActions>
          <Box mx={3}>
            <Button autoFocus variant="contained" onClick={handleCancel}>
              Cancel
            </Button>
          </Box>
          <Box mx={3}>
            <Button variant="contained" color="error" onClick={handleOk}>
              DELETE
            </Button>
          </Box>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default function DeleteRoundDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue?: string) => {
    setOpen(false);
  };

  return (
    <Box textAlign="center">
      <Box textAlign="center" mb={2}>
        <Button onClick={handleClickListItem} size="medium" variant="contained" color="error">
          <DeleteForeverOutlined />
          <Typography ml={1} textAlign="center">
            Delete Round
          </Typography>
        </Button>
      </Box>
      <ConfirmationDialogRaw
        id="confirmation-menu"
        keepMounted
        open={open}
        onClose={handleClose}
        value={""}
      />
    </Box>
  );
}
