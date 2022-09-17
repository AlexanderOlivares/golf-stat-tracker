import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Button } from "@mui/material";

const SignOutMutation = gql`
  mutation SignOutMutation {
    signOut
  }
`;

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
