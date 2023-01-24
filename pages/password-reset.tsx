import React, { useState, useEffect } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { emailAddressValidator, usernameAndPasswordValidator } from "../utils/formValidator";
import { useRouter } from "next/router";
import Link from "next/link";
import { queryParamToString } from "../utils/queryParamFormatter";
import { useMutation } from "@apollo/client";
import { ResetPasswordMutation } from "./api/graphql/mutations/authMutations";
import { setCookie } from "../utils/authCookieGenerator";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { parseErrorMessage } from "../utils/errorMessage";
import * as Sentry from "@sentry/nextjs";
import LoadingBackdrop from "../components/LoadingBackdrop";

interface IResetPasswordCreds {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { email, token } = router.query;
  const authContext = useAuthContext();
  const [resetPassword] = useMutation(ResetPasswordMutation);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetPasswordCreds, setResetPasswordCreds] = useState<IResetPasswordCreds>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const removeInputError = (registrationCreds: IResetPasswordCreds) => {
    const { email, password, confirmPassword } = registrationCreds;
    if (passwordError && password.length >= 8) setPasswordError(false);
    if (passwordConfirmationError && confirmPassword.length >= 8) setPasswordError(false);
    if (emailError && emailAddressValidator(email)) setEmailError(false);
    if (password === confirmPassword) setPasswordConfirmationError(false);
  };

  const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value }: { name: string; value: string } = event.target;
    setResetPasswordCreds(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsLoading(true);
      event.preventDefault();
      const validPasswordFields = validatePasswords(resetPasswordCreds);
      if (!validPasswordFields) return;
      const { email, password, confirmPassword } = resetPasswordCreds;
      if (password !== confirmPassword) return;

      const { data } = await resetPassword({
        variables: {
          email: queryParamToString(email),
          password: confirmPassword,
          token: queryParamToString(token),
        },
      });

      const { username, token: accessToken } = data.resetPassword;

      if (!accessToken) throw Error("Error logging in");
      const decodedPayload = window.atob(data.resetPassword.token.split(".")[1]);
      setCookie(`authToken`, decodedPayload);
      const payload = JSON.parse(decodedPayload);

      authContext.dispatch({
        type: "update auth status",
        payload: {
          tokenPayload: payload,
          isAuth: true,
        },
      });

      toast.success(`Password was reset. Welcome back ${username}`);
      router.push(`/${username}/profile`);
    } catch (error) {
      Sentry.captureException(error);
      setIsLoading(false);
      toast.error(parseErrorMessage(error));
    }
  };

  const validatePasswords = ({ password, confirmPassword }: IResetPasswordCreds) => {
    const validPassword = usernameAndPasswordValidator(password);
    const validPasswordConfirmation = usernameAndPasswordValidator(confirmPassword);
    if (!validPassword) setPasswordError(true);
    if (!validPasswordConfirmation) setPasswordError(true);
    if (password !== confirmPassword) setPasswordConfirmationError(true);
    return validPassword && validPasswordConfirmation;
  };

  useEffect(() => {
    if (router.isReady) {
      const decodedEmail = window.atob(queryParamToString(email));
      setResetPasswordCreds(prev => {
        return {
          ...prev,
          email: decodedEmail,
        };
      });
    }
  }, [router.isReady]);

  useEffect(() => {
    removeInputError(resetPasswordCreds);
  }, [resetPasswordCreds]);

  return (
    <>
      {isLoading && <LoadingBackdrop showBackdrop={isLoading} />}
      <Typography variant="h5" mt={2} textAlign="center">
        {resetPasswordCreds.email} Password Reset
      </Typography>
      <Box component="form" textAlign="center" onSubmit={submitForm} noValidate autoComplete="off">
        <Box
          sx={{
            "& > :not(style)": { mx: 1, width: "25ch" },
          }}
        >
          <TextField
            onChange={handleFormInput}
            margin="dense"
            name="password"
            id="filled-basic"
            label="new password"
            variant="filled"
            type="password"
            error={passwordError}
            helperText={passwordError ? "must be at least 8 characters" : ""}
            required
          />
        </Box>
        <Box
          sx={{
            "& > :not(style)": { mx: 1, width: "25ch" },
          }}
        >
          <TextField
            onChange={handleFormInput}
            margin="dense"
            name="confirmPassword"
            id="standard-basic"
            label="confirm new password"
            variant="filled"
            type="password"
            error={passwordConfirmationError}
            helperText={passwordConfirmationError ? "passwords do not match" : ""}
            required
          />
        </Box>
        <Box mt={3}>
          <Button type="submit" size="medium" variant="contained" color="primary">
            Reset password
          </Button>
        </Box>
        <Box pt={3}>
          <Link href="/login">
            <a>
              <Typography variant="subtitle2">
                Already have an account?&nbsp;
                <u>Login</u>
              </Typography>
            </a>
          </Link>
        </Box>
      </Box>
    </>
  );
}
