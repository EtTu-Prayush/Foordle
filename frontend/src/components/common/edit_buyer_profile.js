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
import { ListItemText } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const theme = createTheme();

export default function SignUp(props) {
  const user_email = localStorage.getItem("email");
  console.log(user_email);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [batch, setBatch] = React.useState("");
  const [age, setAge] = React.useState("");

  const resetInput = () => {
    setName("");
    setEmail("");
    setPassword("");
    setContact("");
    setBatch("");
    setAge("");
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
  const on_change_age = (event) => {
    setAge(event.target.value);
  };
  const on_change_batch = (event) => {
    setBatch(event.target.value);
  };

  React.useEffect(() => {
    if (user_email) {
      axios
        .post("api/buyer/profile", { email: user_email })
        .then((res) => {
          setName(res.data["name"]);
          setContact(res.data["contact_number"]);
          setEmail(res.data["email"]);
          setPassword(res.data["password"]);
          setBatch(res.data["batch_name"]);
          setAge(res.data["age"]);
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
    const newBuyer = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      contact_number: data.get("contact_number"),
      batch_name: data.get("batch_name"),
      age: data.get("age"),
    };

    console.log(newBuyer);

    axios
      .put("api/buyer/edit_profile", newBuyer)
      .then((res) => {
        window.href = "/profile";
        localStorage.setItem("edit", "0");
        alert("Profile Updated");
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
                  name="name"
                  required
                  value={name}
                  onChange={on_change_name}
                  fullWidth
                  id="name"
                  label="Name"
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
                  value={age}
                  onChange={on_change_age}
                  id="age"
                  label="Age"
                  name="age"
                  autoComplete={age}
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
                  name="contact_number"
                  autoComplete="contact_number"
                />
              </Grid>
              <Grid item xs={12}>
                <ListItemText primary="Batch" />
                <FormControl required fullWidth>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    name="batch_name"
                    value={batch}
                    onChange={on_change_batch}
                  >
                    <MenuItem value={"UG1"}>UG1</MenuItem>
                    <MenuItem value={"UG2"}>UG2</MenuItem>
                    <MenuItem value={"UG3"}>UG3</MenuItem>
                    <MenuItem value={"UG4"}>UG4</MenuItem>
                    <MenuItem value={"UG5"}>UG5</MenuItem>
                  </Select>
                </FormControl>
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
      </Container>
    </ThemeProvider>
  );
}
