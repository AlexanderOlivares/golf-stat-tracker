import { Box } from "@mui/material";
import React, { useEffect } from "react";
import ClubSelectChip from "../../components/ClubSelectChip";
import { Typography } from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { queryParamToString } from "../../utils/queryParamFormatter";
import { toast } from "react-toastify";

export default function MyClubs() {
  const router = useRouter();
  const { username } = router.query;
  const authContext = useAuthContext();
  const { isAuth, tokenPayload } = authContext.state;

  const usernameIsAuthorized = isAuth && tokenPayload?.username == queryParamToString(username);

  useEffect(() => {
    if (router.isReady && !usernameIsAuthorized) {
      toast.error("Please login to select clubs");
      router.push("/login");
    }
  }, [isAuth]);

  return (
    <>
      <Box textAlign="center" mt={3}>
        <Typography variant="h3">My Clubs</Typography>
        <Box mt={2}>
          <Typography variant="subtitle2">Build your bag</Typography>
        </Box>
        <ClubSelectChip />
      </Box>
    </>
  );
}
