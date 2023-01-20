import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { emailAddressValidator } from "../utils/formValidator";
import Link from "next/link";
import { getUserByEmail } from "./api/graphql/queries/emailQuery";
import { useLazyQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { parseErrorMessage } from "../utils/errorMessage";
import * as Sentry from "@sentry/nextjs";

export default function RequestPasswordReset() {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [emailWasSent, setEmailWasSent] = useState<boolean>(false);
  const [verifyEmail] = useLazyQuery(getUserByEmail);

  function handleFormInput(event: React.ChangeEvent<HTMLInputElement>) {
    removeInputError(email);
    setEmail(event.target.value);
  }

  function validateEmail(email: string) {
    const validEmail = emailAddressValidator(email);
    if (!validEmail) setEmailError(true);
    return validEmail;
  }

  function removeInputError(email: string) {
    if (emailError && emailAddressValidator(email)) setEmailError(false);
  }

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const emailFormattedCorrectly = validateEmail(email);
      if (!emailFormattedCorrectly) {
        return;
      }
      const { error } = await verifyEmail({
        variables: {
          email,
        },
      });

      if (error) {
        setEmailWasSent(false);
        toast.error(parseErrorMessage(error));
        return;
      }

      setEmailWasSent(true);
    } catch (error) {
      Sentry.captureException(error);
      toast.error(parseErrorMessage(error));
    }
  };

  return (
    <>
      <Typography mt={2} variant="h5" textAlign="center">
        Reset Password
      </Typography>
      {emailWasSent ? (
        <Box>
          <Typography mt={2} variant="h6" textAlign="center">
            Password reset email was sent to {email}
          </Typography>
        </Box>
      ) : (
        <Box
          component="form"
          textAlign="center"
          onSubmit={submitForm}
          noValidate
          autoComplete="off"
        >
          <Box
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
          <Box mt={3}>
            <Button type="submit" size="medium" variant="contained" color="primary">
              Send Reset Email
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
      )}
    </>
  );
}
