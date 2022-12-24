import React, { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { getCookie } from "../utils/authCookieGenerator";

export default function AuthPersist() {
  const authContext = useAuthContext();
  useEffect(() => {
    const authCookie = getCookie("authToken");
    if (authCookie) {
      authContext.dispatch({
        type: "update auth status",
        payload: {
          tokenPayload: authCookie,
          isAuth: true,
        },
      });
    }
  }, []);
  return <></>;
}
