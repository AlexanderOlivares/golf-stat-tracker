import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

interface ILoginCreds {
  email: string;
  password: string;
}

export default function Login() {
  const [loginCreds, setLoginCreds] = useState({
    email: "",
    password: "",
  });

  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="username" variant="filled" />
      <TextField id="filled-basic" label="email" variant="filled" />
      <TextField id="standard-basic" label="password" variant="filled" />
    </Box>
  );
}
