import React, { useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box, TextField, Button } from "@mui/material";
import { emailAddressValidator, usernameAndPasswordValidator } from "../utils/formValidator";
import { registerMutation } from "./api/graphql/mutations/authMutations";
import { useMutation } from "@apollo/client";

export interface IRegistrationCreds {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const [register] = useMutation(registerMutation);
  const router = useRouter();
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [registrationCreds, setRegistrationCreds] = useState<IRegistrationCreds>({
    username: "",
    email: "",
    password: "",
  });

  const removeInputError = (registrationCreds: IRegistrationCreds) => {
    const { username, password, email } = registrationCreds;
    if (usernameError && username.length >= 8) setUsernameError(false);
    if (passwordError && password.length >= 8) setPasswordError(false);
    if (emailError && emailAddressValidator(email)) setEmailError(false);
  };

  const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    removeInputError(registrationCreds);
    const { name, value }: { name: string; value: string } = event.target;
    setRegistrationCreds(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();

      const isValdidEmail = validateEmail(registrationCreds);
      const isValidUsernameAndPassword = validateUserNameAndPassword(registrationCreds);

      if (!isValdidEmail || !isValidUsernameAndPassword) {
        console.log("INVALID FORMAT");
        return;
      }

      const { data } = await register({
        variables: {
          username: registrationCreds.username,
          email: registrationCreds.email,
          password: registrationCreds.password,
        },
      });

      const { username } = data.register;

      router.push(`/profile/${username}`);
    } catch (error) {
      console.log(error);
      // add toast error here
    }
  };

  const validateUserNameAndPassword = ({ username, password }: IRegistrationCreds) => {
    const validUsername = usernameAndPasswordValidator(username);
    const validPassword = usernameAndPasswordValidator(password);
    if (!validUsername) setUsernameError(true);
    if (!validPassword) setPasswordError(true);
    return validUsername && validPassword;
  };

  const validateEmail = ({ email }: IRegistrationCreds) => {
    const validEmail = emailAddressValidator(email);
    if (!validEmail) setEmailError(true);
    return validEmail;
  };

  return (
    <Box
      component="form"
      onSubmit={submitForm}
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        onChange={handleFormInput}
        name="username"
        id="outlined-basic"
        label="username"
        variant="filled"
        error={usernameError}
        helperText={usernameError ? "must be at least 8 characters" : ""}
        required
      />
      <TextField
        onChange={handleFormInput}
        name="email"
        id="filled-basic"
        label="email"
        variant="filled"
        type="email"
        error={emailError}
        helperText={emailError ? "invalid email address" : ""}
        required
      />
      <TextField
        onChange={handleFormInput}
        name="password"
        id="standard-basic"
        label="password"
        variant="filled"
        type="password"
        error={passwordError}
        helperText={passwordError ? "must be at least 8 characters" : ""}
        required
      />
      <Box m={3}>
        <Button type="submit" size="medium" variant="contained" color="primary">
          create golfer account
        </Button>
      </Box>
    </Box>
  );
}
