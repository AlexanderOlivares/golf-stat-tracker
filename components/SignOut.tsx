import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import { SignOutMutation } from "../pages/api/graphql/mutations/authMutations";

function SignOut() {
  const [signOut] = useMutation(SignOutMutation);
  const signOutUser = () => {
    signOut();
  };
  return (
    <Button size="medium" variant="contained" color="primary" onClick={signOutUser}>
      SignOut
    </Button>
  );
}

export default SignOut;
