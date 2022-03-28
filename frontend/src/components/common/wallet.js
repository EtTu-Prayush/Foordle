import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Avatar from "@mui/material/Avatar";

import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/AccountBalanceWallet";

const theme = createTheme();

export default function Wallet(props) {
  let user_email = localStorage.getItem("email");
  const [wallet, setWallet] = useState(-1);

  React.useEffect(() => {
    axios
      .post("api/buyer/wallet_balance", {
        email: user_email,
      })
      .then((res) => {
        console.log(res.data);
        setWallet(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  } );

  onsubmit = (event) => {
    event.preventDefault();
    var data = new FormData(event.target);
    const obj = {
      email: user_email,
      wallet_balance: data.get("wallet"),
    };
    console.log(obj);
    axios
      .put("api/buyer/add_wallet_balance", obj)
      .then((res) => {
        if (res.error) {
          alert(res.error);
          window.location.reload();
        } else {
          console.log(res.data);
          alert("Wallet Updated");
          window.location.reload();
          setWallet(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add Balance
          </Typography>
          <Box component="form" onSubmit={onsubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="wallet"
              type="number"
              label="Add Balance"
              name="wallet"
              autoComplete="wallet"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Balance
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
