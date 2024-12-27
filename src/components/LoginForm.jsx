import React from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  onRegister,
  onLogin,
}) => (
  <Box>
    <Typography variant="h6" gutterBottom>
      Register / Login
    </Typography>
    <TextField
      fullWidth
      label="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      margin="normal"
    />
    <TextField
      fullWidth
      label="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      margin="normal"
    />
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
      <Button variant="contained" onClick={onRegister}>
        Register
      </Button>
      <Button variant="contained" color="primary" onClick={onLogin}>
        Login
      </Button>
    </Box>
  </Box>
);

export default LoginForm;
