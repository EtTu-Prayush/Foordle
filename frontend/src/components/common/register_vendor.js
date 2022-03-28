import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignUp(props) {
  const [manager_name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [shop_name, setShop] = React.useState("");
  const [open_time, setOpenTime] = React.useState("");
  const [close_time, setCloseTime] = React.useState("");

  const resetInput = () => {
    setName("");
    setEmail("");
    setPassword("");
    setContact("");
    setShop("");
    setOpenTime("");
    setCloseTime("");
  };

  const on_change_name = (event) => {
    console.log("Hello!");
    setName(event.target.value);
  };

  const on_change_email = (event) => {
    setEmail(event.target.value);
  };

  const on_change_password = (event) => {
    setPassword(event.target.value);
  };

  const on_change_contact = (event) => {
    setContact(event.target.value);
  };

  const on_change_shop = (event) => {
    setShop(event.target.value);
  };

  const on_change_open_time = (event) => {
    setOpenTime(event.target.value);
  };
  const on_change_close_time = (event) => {
    setCloseTime(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const newVendor = {
      manager_name: data.get("manager_name"),
      email: data.get("email"),
      password: data.get("password"),
      contact_number: data.get("contact"),
      shop_name: data.get("shop_name"),
      open_time: data.get("open_time"),
      close_time: data.get("close_time"),
    };
    console.log(newVendor);
    axios
      .post("api/vendor/register", newVendor)
      .then((res) => {
        if (res.status === 200)
          alert("Registered Succesful")
        else alert("Failed")
        console.log(res);
      })
      .catch((err) => {
        alert("Failed")
        console.log(err.response.data);
      });
    // eslint-disable-next-line no-console
    resetInput();
    //window.location.reload();
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="manager_name"
                  required
                  fullWidth
                  id="manager_name"
                  label="Manager Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="shop_name"
                  label="Shop Name"
                  name="shop_name"
                  autoComplete="shop_name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contact_number"
                  label="Contact Number"
                  name="contact"
                  autoComplete="contact_number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="time"
                  id="open_time"
                  label="Opening Time"
                  name="open_time"
                // autoComplete="open_time"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="time"
                  id="close_time"
                  label="Closing Time"
                  name="close_time"
                //  autoComplete="close_time"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </Box>
        </Box>

      </Container>
    </ThemeProvider>
  );
}
