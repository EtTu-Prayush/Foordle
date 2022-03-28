import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import axios from "axios";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Edit from "./edit_vendor_profile";
import Edituser from "./edit_buyer_profile";
const theme = createTheme();

export default function Profile(props) {
  let userType = localStorage.getItem("user_type");
  let user_email = localStorage.getItem("email");
  localStorage.setItem("edit", "0");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shop_name, setShop] = useState("");
  const [contact_number, setContact] = useState("");
  const [open_time, setOpenTime] = useState("");
  const [close_time, setCloseTime] = useState("");
  const [batch_name, setBatch] = useState("");
  const [age, setAge] = React.useState("");
  const [edit, setEdit] = React.useState("0");

  //console.log(user_email);
  //   console.log("Here hehe" + userType);
  if (userType === "vendor") {
    axios
      .post("api/vendor/profile", { email: user_email })
      .then((response) => {
        setName(response.data.manager_name);
        setEmail(response.data.email);
        setContact(response.data.contact_number);
        setShop(response.data.shop_name);
        setOpenTime(response.data.open_time);
        setCloseTime(response.data.close_time);
      })
      .catch((err) => {
        console.log(err);
      });
    return edit === "0" ? (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Contact Number</TableCell>
              <TableCell>{contact_number}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Shop Name</TableCell>
              <TableCell>{shop_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Open Time</TableCell>
              <TableCell>{open_time}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Close Time</TableCell>
              <TableCell>{close_time}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box>
          <Button onClick={() => setEdit("1")}>Edit Profile</Button>
        </Box>
      </TableContainer>
    ) : (
      <Edit />
    );
  } else if (userType === "buyer") {
    axios
      .post("api/buyer/profile", { email: user_email })

      .then((response) => {
        setName(response.data.name);
        setEmail(response.data.email);
        setContact(response.data.contact_number);
        setBatch(response.data.batch_name);
        setAge(response.data.age);
      })
      .catch((err) => {
        //  console.log("Here11");
        console.log(err);
      });

    return edit === "0" ? (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          {/* <TableHead>
            <TableRow align="center">
              <TableCell align="center" justifyContent="center">User Profile</TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>{email}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Contact Number</TableCell>
              <TableCell>{contact_number}</TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Batch Name</TableCell>
              <TableCell>{batch_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>age</TableCell>
              <TableCell>{age}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box>
          <Button onClick={() => setEdit("1")}>Edit Profile</Button>
        </Box>
      </TableContainer>
    ) : (
      <Edituser />
    );
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              marginTop: "20vh",
            }}
          >
            <Typography variant="h4">
              You are not authorized to view this page.
            </Typography>
            <Typography variant="h6">
              Please login to view this page.
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }
}
