import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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
  const user_email = localStorage.getItem("email");
  console.log(user_email);
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
  React.useEffect(() => {
    if (user_email) {
      axios
        .post("api/vendor/profile", { email: user_email })
        .then((res) => {
          setName(res.data["manager_name"]);
          setEmail(res.data["email"]);
          setPassword(res.data["password"]);
          setContact(res.data["contact_number"]);
          setShop(res.data["shop_name"]);
          setOpenTime(res.data["open_time"]);
          setCloseTime(res.data["close_time"]);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

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
      .put("api/vendor/edit_profile", newVendor)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("edit", "0");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    alert("Profile Updated");
    localStorage.setItem("edit", "0");
    window.location = "/profile";

    // eslint-disable-next-line no-console
    resetInput();
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
            Edit Profile
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
                  value={manager_name}
                  onChange={on_change_name}
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
                  onChange={on_change_email}
                  value={email}
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  value={shop_name}
                  onChange={on_change_shop}
                  id="shop_name"
                  label="Shop Name"
                  name="shop_name"
                  autoComplete={shop_name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contact_number"
                  value={contact}
                  onChange={on_change_contact}
                  label="Contact Number"
                  name="contact"
                  autoComplete="contact_number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="open_time"
                  type="time"
                  onChange={on_change_open_time}
                  value={open_time}
                  label="Opening Time"
                  name="open_time"
                  autoComplete="open_time"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="close_time"
                  type="time"
                  onChange={on_change_close_time}
                  value={close_time}
                  label="Closing Time"
                  name="close_time"
                  autoComplete="close_time"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  onChange={on_change_password}
                  value={password}
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
              Save Changes
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
