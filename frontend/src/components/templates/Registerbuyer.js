import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { FormControl } from "@mui/material";
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

export default function SignUpB() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("qwerty");
  const [age, setAge] = React.useState(0);
  const [batch, setBatch] = React.useState("");
  const [contact, setContact] = React.useState("");
  
  const [emailbool, setEmailbool] = React.useState(true);
  const [contactbool, setContactbool] = React.useState(true);

  const handlename = (event) => {
    setName(event.target.value);
  };
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
  };
  const handleage = (event) => {
    setAge(event.target.value);
  };
  const handlebatch = (event) => {
    setBatch(event.target.value);
  };
  const handlecontact = (event) => {
    event.preventDefault();
    setContact(event.target.value);
    let regex = /^[0-9]{10}$/;
    // eslint-disable-next-line no-console

    if (regex.test(event.target.value)) {
      setContactbool(true);
    } else {
      setContactbool(false);
    }
  };

  const handleRegistration = (event) => {
    event.preventDefault();
    if(email!=="" && password!=="" && name!=="" && age!==0 && batch!=="" && contact!=="" && emailbool===true && contactbool===true &&password.length >= 6){
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      age: data.get("age"),
      batch: data.get("batch"),
      contact: data.get("contact"),
    });
    axios
      .post("/api/user/registerbuyer", {
        name: data.get("name"),
        email: data.get("email"),
        password: data.get("password"),
        age: data.get("age"),
        batch: data.get("batch"),
        contact: data.get("contact"),
      })
      .then(function (response) {
        console.log(response);
        alert("Registration Successful");
      })
      .catch(function (error) {
        console.log(error);
        alert("Registration Failed");
      });
    }
    else{
      alert("Please fill all the details(correctly)");
    }
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
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  autoFocus
                  onChange={handlename}
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
                  //helperText={!emailbool ? "Enter a valid email" : ""}
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
                  onChange={handlepassword}
                  //password should be atleast 6 characters
                  error={password.length < 6}
                  helperText={password.length < 6 ? "Password should be atleast 6 characters": ""}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  name="age"
                  label="Age"
                  id="age"
                  onChange={handleage}
                  
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="batch-select-label" required>
                    Batch
                  </InputLabel>
                  <Select
                    fullWidth
                    labelId="batch-select-label"
                    id="demo-batch-select"
                    name="batch"
                    id="batch"
                    // value={buyer ? 'buyer' : vendor ? 'vendor' : 'Select'}
                    value={batch}
                    label="Batch"
                    onChange={handlebatch}
                  >
                    <MenuItem value={0}>UG1</MenuItem>
                    <MenuItem value={1}>UG2</MenuItem>
                    <MenuItem value={2}>UG3</MenuItem>
                    <MenuItem value={3}>UG4</MenuItem>
                    <MenuItem value={4}>UG5</MenuItem>
                    <MenuItem value={5}>PG1</MenuItem>
                    <MenuItem value={6}>PG2</MenuItem>
                  </Select>
                </FormControl>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}
