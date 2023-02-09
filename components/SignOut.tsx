import React from "react";
import { useMutation } from "@apollo/client";
import { Button } from "@mui/material";
import { SignOutMutation } from "../pages/api/graphql/mutations/authMutations";
import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";
import { removeCookie } from "../utils/authCookieGenerator";

function SignOut() {
  const authContext = useAuthContext();
  const router = useRouter();
  const [signOut] = useMutation(SignOutMutation);
  const signOutUser = () => {
    signOut();
    removeCookie("authToken");
    authContext.dispatch({
      type: "update auth status",
      payload: {
        tokenPayload: null,
        isAuth: false,
      },
    });
    return router.push("/login");
  };
  return (
    <Button size="medium" onClick={signOutUser} sx={{ my: 2, color: "black", display: "block" }}>
      logout
    </Button>
  );
}

export default SignOut;
