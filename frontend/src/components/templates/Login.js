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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import ls from "local-storage";

// function Copyright(props) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const theme = createTheme();

export default function SignInSide() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailbool, setEmailbool] = React.useState(true);
  const [passwordbool, setPasswordbool] = React.useState(true);

  const handleemail = (event) => {
    event.preventDefault();
    setEmail(event.target.value);
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // eslint-disable-next-line no-console

    if (regex.test(event.target.value)) {
      setEmailbool(true);
    } else {
      setEmailbool(false);
    }
  };

  const handlepassword = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
    if (event.target.value.length >= 6) {
      setPasswordbool(true);
    }
    else {
      setPasswordbool(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (emailbool && passwordbool && email !== "" && password !== " ") 
    {
      const data = new FormData(event.currentTarget);
      // eslint-disable-next-line no-console
      console.log({
        email: data.get("email"),
        password: data.get("password"),
      });
      axios
        .post("/api/user/login", {
          email: data.get("email"),
          password: data.get("password"),
        })
        .then(function (response) {
          // eslint-disable-next-line no-console
          console.log(response);
          alert("Login Successful");
          //window.location.href="../common/Dashboardbuyer"
          window.location = "/";
          ls.set("email", response.data.user.email);
          //ls.set("password", response.data.user.password);
          ls.set("usertype", response.data.usertype);
          if(response.data.usertype==1)
          {
          ls.set("username", response.data.user.name);
          }
        })
        .catch(function (error) {
          console.log(error);
          alert("Login Failed");
        });
    } 
    else 
    {
      alert("Please fill all the fields");
    }
  };

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
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleemail}
                error={!emailbool}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlepassword}
                error={!passwordbool}
                helpertext={
                  !passwordbool
                    ? "Password must be at least 6 characters long"
                    : ""
                }
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
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
