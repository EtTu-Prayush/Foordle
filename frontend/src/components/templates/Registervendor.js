import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

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

export default function SignUpV() {

  
  const [emailbool, setEmailbool] = React.useState(true);
  const [contactbool, setContactbool] = React.useState(true);
  const [password, setPassword] = React.useState("qwerty");
  const handleemail = (event) => {
    event.preventDefault();
    let regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // eslint-disable-next-line no-console

    if (regex.test(event.target.value)) {
      setEmailbool(true);
    } else {
      setEmailbool(false);
    }
  };

  const handlecontact = (event) => {
    event.preventDefault();
    let regex = /^[0-9]{10}$/;
    // eslint-disable-next-line no-console

    if (regex.test(event.target.value)) {
      setContactbool(true);
    } else {
      setContactbool(false);
    }
  };

  const handlepassword = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const handleRegistration = (event) => {
    event.preventDefault();


    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      managername: data.get("managername"),
      email: data.get("email"),
      password: data.get("password"),
      shopname: data.get("shopname"),
      contact: data.get("contact"),
      opentime: data.get("opentime"),
      closetime: data.get("closetime"),
    });
    if( emailbool && contactbool && password.length>=6){
    axios
      .post("/api/user/registervendor", {
        managername: data.get("managername"),
        email: data.get("email"),
        password: data.get("password"),
        shopname: data.get("shopname"),
        contact: data.get("contact"),
        opentime: data.get("opentime"),
        closetime: data.get("closetime"),
      })
      .then(function (response) {
        console.log(response);
        alert("Registeration Successful");
      })
      .catch(function (error) {
        console.log(error);
        alert("Registeration Failed");
      });
    }
    else{
      alert("Please fill all the details(correctly)");
    }
  };

  // axios.post('/api/user/registervendor', newVendor)
  // .then(res => {
  //   alert("Vendor Registered")
  //   console.log(res.data)
  // })
  // .catch(err => {
  //   alert("Vendor Registration Failed")
  // })

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
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleRegistration}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="managername"
                  required
                  fullWidth
                  id="managername"
                  label="Manager's Name"
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
                  onChange={handleemail}
                  error={!emailbool}
                  helperText={!emailbool ? "Enter a valid email": ""}
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
                  onChange={handlepassword}
                  error={password.length < 6}
                  helperText={password.length < 6 ? "Password must be atleast 6 characters long": ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="shopname"
                  label="Shop Name"
                  name="shopname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="contact"
                  label="Contact Number"
                  name="contact"
                  onChange={handlecontact}
                  error={!contactbool}
                  helperText={
                    !contactbool ? "Enter a valid contact number" : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="time"
                  id="opentime"
                  label="Opening Time"
                  name="opentime"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  focus
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  type="time"
                  id="closetime"
                  label="Closing Time"
                  name="closetime"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              // onClick={handleRegistration}
            >
              Register
            </Button>
            {/* <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
