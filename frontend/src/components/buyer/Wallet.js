import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import ls from "local-storage";
import { useEffect } from "react";
import { useState } from "react";

const theme = createTheme();

export default function Wallet() {
  const [wallet, setWallet] = React.useState("");
  const [add, setAdd] = React.useState(0);
  const [positive, setPositive] = React.useState(true);
    useEffect(() => {
        axios
            .post("/api/buyer/walletdetails", {
                email: ls.get("email"),
            })
            .then((res) => {
                setWallet(res.data.wallet);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handlechange = (e) => {
        if(e.target.value>=0 || e.target.value===""){
            setPositive(true);
            setAdd(e.target.value);
        }
        else{
            setPositive(false);
            setAdd(0);
        }
    }

    const handleSubmit = (e) => {
        if(add !== 0 || add !== ""){
        e.preventDefault();
        axios
            .post("/api/buyer/addmoney", {
                email: ls.get("email"),
                amount: add,
            })
            .then((res) => {
                setWallet(res.data.wallet);
            })
            .catch((err) => {
                console.log(err);
            });
          }
    }

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <AccountBalanceWalletIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              My Wallet
            </Typography>
            <Box
              component="form"
              noValidate
            onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="current"
                label=""
                name="current"
                type="number"
                variant="standard"
                InputProps={{
                    readOnly: true,
                }}
                value={wallet}
              />
              <TextField
                margin="normal"
                fullWidth
                name="addamount"
                label="Add Money"
                InputLabelProps={{
                    shrink: true,
                }}
                type="number"
                id="addamount"
                onChange={handlechange}
                error={!positive}
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={!positive }
                sx={{ mt: 3, mb: 2 }}
              >
                Add Money
              </Button>
              <Grid container></Grid>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
