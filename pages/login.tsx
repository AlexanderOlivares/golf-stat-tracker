import React, { useState } from "react";
import { useRouter } from "next/router";
import { Typography, Box, TextField, Button } from "@mui/material";
import {
  emailAddressValidator,
  usernameAndPasswordValidator,
} from "../utils/formValidator";
import { useQuery } from "@apollo/client";
import appolloClient from "../apollo-client";
import { gql } from "apollo-server-micro";
import { GetStaticPropsResult } from "next";

interface ILoginCreds {
  email: string;
  password: string;
}

type User = {
  userid: String;
  username: String;
  email: String;
  password: String;
};

export const GET_USERS = gql`
  query ExampleQuery {
    users {
      userid
      username
      email
      password
    }
  }
`;

export default function Login() {
  //   const { loading, error, data } = useQuery(GET_USERS);
  //   console.log(data);
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
    event.preventDefault();

    const isValdidEmail = validateEmail(loginCreds);
    const isValidUsernameAndPassword = validateUserNameAndPassword(loginCreds);

    if (!isValdidEmail || !isValidUsernameAndPassword) {
      console.log("INVALID FORMAT");
      return;
    }

    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(loginCreds),
      };
      const res = await fetch("/api/login", requestOptions);
      const { message, userId } = await res.json();

      if (res.status === 200) {
        // add toast success with message here
        console.log(message);
        router.push(`/profile/${userId}`);
      }
    } catch (error) {
      console.log(error);
      // add toast error here
    }
  };

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

  const logout = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    };
    const res = await fetch("/api/logout", requestOptions);
    const { message } = await res.json();
    console.log(message);
    // TODO - display message and redirect to login
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
        <Button onClick={logout} size="medium" variant="contained" color="primary">
          logout
        </Button>
      </Box>
    </Box>
  );
}

// export async function getServerSideProps() {
//   const { data }: { data: User[] } = await appolloClient.query({ query: GET_USERS });

//   return {
//     props: {
//       data,
//     },
//   };
// }
