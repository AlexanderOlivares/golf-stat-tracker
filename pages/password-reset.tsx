import React, { useState, useEffect } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";
import { emailAddressValidator, usernameAndPasswordValidator } from "../utils/formValidator";
import { useRouter } from "next/router";
import Link from "next/link";

interface IResetPasswordCreds {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();
  const { username } = router.query;
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [resetPasswordCreds, setResetPasswordCreds] = useState<IResetPasswordCreds>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const removeInputError = (registrationCreds: IResetPasswordCreds) => {
    const { email, password, confirmPassword } = registrationCreds;
    if (passwordError && password.length >= 8) setPasswordError(false);
    if (emailError && emailAddressValidator(email)) setEmailError(false);
  };

  const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    removeInputError(resetPasswordCreds);
    const { name, value }: { name: string; value: string } = event.target;
    setResetPasswordCreds(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    return;
  };

  return (
    <>
      <Typography variant="h5" mt={2} textAlign="center">
        {username} Password Reset
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
            name="new password"
            id="filled-basic"
            label="new password"
            variant="filled"
            type="email"
            error={emailError}
            helperText={emailError ? "invalid email address" : ""}
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
            name="confirm new password"
            id="standard-basic"
            label="confirm new password"
            variant="filled"
            type="password"
            error={passwordError}
            helperText={passwordError ? "must be at least 8 characters" : ""}
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
