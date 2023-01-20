import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box, TextField, Button } from "@mui/material";
import { emailAddressValidator, usernameAndPasswordValidator } from "../utils/formValidator";
import { useMutation } from "@apollo/client";
import SignOut from "../components/SignOut";
import { loginMutation } from "./api/graphql/mutations/authMutations";
import { useAuthContext } from "../context/AuthContext";
import Link from "next/link";
import { toast } from "react-toastify";
import { parseErrorMessage } from "../utils/errorMessage";
import { removeCookie, setCookie } from "../utils/authCookieGenerator";
import * as Sentry from "@sentry/nextjs";

interface ILoginCreds {
  email: string;
  password: string;
}

export default function Login() {
  const authContext = useAuthContext();
  const [login] = useMutation(loginMutation);
  const router = useRouter();
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [loginCreds, setLoginCreds] = useState<ILoginCreds>({
    email: "",
    password: "",
  });

  const removeInputError = (registrationCreds: ILoginCreds) => {
    const { password, email } = registrationCreds;
    if (passwordError && password.length >= 8) setPasswordError(false);
    if (emailError && emailAddressValidator(email)) setEmailError(false);
  };

  const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    removeInputError(loginCreds);
    const { name, value }: { name: string; value: string } = event.target;
    setLoginCreds(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const isValdidEmail = validateEmail(loginCreds);
      const isValidUsernameAndPassword = validateUserNameAndPassword(loginCreds);

      if (!isValdidEmail || !isValidUsernameAndPassword) {
        console.log("INVALID FORMAT");
        return;
      }

      const { data } = await login({
        variables: {
          email: loginCreds.email,
          password: loginCreds.password,
        },
      });

      const { username, token } = data.login;

      if (!token) throw Error("Error logging in");
      const decodedPayload = window.atob(data.login.token.split(".")[1]);
      setCookie(`authToken`, decodedPayload);
      const payload = JSON.parse(decodedPayload);

      authContext.dispatch({
        type: "update auth status",
        payload: {
          tokenPayload: payload,
          isAuth: true,
        },
      });

      toast.success(`Welcome back ${username}`);
      router.push(`/${username}/profile`);
    } catch (error) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
    }
  };

  useEffect(() => {
    removeCookie("authToken");
    authContext.dispatch({
      type: "update auth status",
      payload: {
        tokenPayload: null,
        isAuth: false,
      },
    });
  }, []);

  const validateUserNameAndPassword = ({ password }: ILoginCreds) => {
    const validPassword = usernameAndPasswordValidator(password);
    if (!validPassword) setPasswordError(true);
    return validPassword;
  };

  const validateEmail = ({ email }: ILoginCreds) => {
    const validEmail = emailAddressValidator(email);
    if (!validEmail) setEmailError(true);
    return validEmail;
  };

  return (
    <Box component="form" onSubmit={submitForm} textAlign="center" noValidate autoComplete="off">
      <Box mt={3}>
        <Typography variant="h4">Login</Typography>
      </Box>
      <Box
        mt={3}
        sx={{
          "& > :not(style)": { mx: 1, width: "25ch" },
        }}
      >
        <TextField
          onChange={handleFormInput}
          margin="dense"
          name="email"
          id="filled-basic"
          label="email"
          variant="filled"
          type="email"
          error={emailError}
          helperText={emailError ? "invalid email address" : ""}
          required
        />
      </Box>
      <Box
        m={2}
        sx={{
          "& > :not(style)": { mx: 1, width: "25ch" },
        }}
      >
        <TextField
          onChange={handleFormInput}
          margin="dense"
          name="password"
          id="standard-basic"
          label="password"
          variant="filled"
          type="password"
          error={passwordError}
          helperText={passwordError ? "must be at least 8 characters" : ""}
          required
        />
      </Box>
      <Box
        pt={2}
        sx={{
          "& > :not(style)": { mx: 1, width: "25ch" },
        }}
      >
        <Button type="submit" size="large" variant="contained" color="primary">
          login
        </Button>
      </Box>
      <Box pt={3}>
        <Link href="/request-password-reset">
          <a>
            <Typography variant="subtitle2">
              <u>Forgot password?</u>
            </Typography>
          </a>
        </Link>
      </Box>
      <Box pt={3}>
        <Link href="/register">
          <a>
            <Typography variant="subtitle2">
              Not registered?&nbsp;
              <u>Create golfer account</u>
            </Typography>
          </a>
        </Link>
      </Box>
      <Box m={3}>
        <SignOut />
      </Box>
    </Box>
  );
}
