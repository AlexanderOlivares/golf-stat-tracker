import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";

interface IRegistrationCreds {
  username: string;
  email: string;
  password: string;
}

export default function Login() {
  const [validInputFields, setValidInputFields] = useState<boolean>(false);
  const [registrationCreds, setRegistrationCreds] = useState<IRegistrationCreds>({
    username: "",
    email: "",
    password: "",
  });

  const handleFormInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value }: { name: string; value: string } = event.target;
    setRegistrationCreds(prev => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(registrationCreds),
    };
    const res = await fetch("/api/register", requestOptions);
    const { message } = await res.json();
    console.log(message);
    //   setFormValues(formEmpty);
  };

  /*
  TO DO:
  validate form inputs
  */

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
        required
      />
      <TextField
        onChange={handleFormInput}
        name="email"
        id="filled-basic"
        label="email"
        variant="filled"
        type="email"
        // error={text === ""}
        error={validInputFields}
        helperText={validInputFields ? "invalid email" : ""}
        required
      />
      <TextField
        onChange={handleFormInput}
        name="password"
        id="standard-basic"
        label="password"
        variant="filled"
        type="password"
        required
      />
      <Box m={3}>
        <Button type="submit" size="medium" variant="contained" color="primary">
          Join The League
        </Button>
      </Box>
    </Box>
  );
}
