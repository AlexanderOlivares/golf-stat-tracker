import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box, TextField, Button } from "@mui/material";
import { emailAddressValidator, usernameAndPasswordValidator } from "../utils/formValidator";
import { useMutation } from "@apollo/client";
import SignOut from "../components/SignOut";
import { loginMutation } from "./api/graphql/mutations/authMutations";
import { useAuthContext } from "../context/AuthContext";

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

      const { username } = data.login;

      authContext.dispatch({
        type: "update auth status",
        payload: {
          ...authContext.state,
          isAuth: true,
        },
      });

      router.push(`/${username}/profile`);
    } catch (error) {
      console.log(error);
      // add toast error here
    }
  };

  useEffect(() => {
    authContext.dispatch({
      type: "update auth status",
      payload: {
        ...authContext.state,
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
          login
        </Button>
      </Box>
      <Box m={3}>
        <SignOut />
      </Box>
    </Box>
  );
}
