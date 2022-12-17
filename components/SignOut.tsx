import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import { SignOutMutation } from "../pages/api/graphql/mutations/authMutations";
import { useRouter } from "next/router";

function SignOut() {
  const router = useRouter();
  const [signOut] = useMutation(SignOutMutation);
  const signOutUser = () => {
    signOut();
    return router.push("/login");
  };
  return (
    <Button size="medium" onClick={signOutUser} sx={{ my: 2, color: "white", display: "block" }}>
      logout
    </Button>
  );
}

export default SignOut;
