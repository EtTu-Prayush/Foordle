import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ls from "local-storage";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Button, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";
import { width } from "@mui/system";
import { MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import { FormControl,InputLabel } from "@mui/material";


const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};

export default function MyProfile() {
  const [name, setName] = React.useState("");
  const [managername, setManagername] = React.useState("");
  const [shopname, setShopname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [age, setAge] = React.useState("");
  const [batch, setBatch] = React.useState(0);
  const [opentime, setOpentime] = React.useState("");
  const [closetime, setClosetime] = React.useState("");

  const [edit, setEdit] = React.useState(false);

  const handleedit = () => {
    setEdit(true);
    //make the fields editable and change the defaultValue
  };

  const handlesave = () => {
    setEdit(false);
    if (ls.get("usertype") === 1) {
      //Set values from the text fields
      setName(document.getElementById("name").value);
      setContact(document.getElementById("contact").value);
      setAge(document.getElementById("age").value);
      // setBatch(document.getElementById("batch").value);

      axios
        .post("/api/user/buyerupdate", {
          email: ls.get("email"),
          name: document.getElementById("name").value,
          contact: document.getElementById("contact").value,
          age: document.getElementById("age").value,
          batch: batch,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      alert("Profile Updated");
      // window.location.reload();
    } else if (ls.get("usertype") === 2) {
      //Set values from the text fields
      setManagername(document.getElementById("managername").value);
      console.log(managername);
      setShopname(document.getElementById("shopname").value);
      setContact(document.getElementById("contactv").value);
      setOpentime(document.getElementById("opentime").value);
      setClosetime(document.getElementById("closetime").value);

      axios
        .post("/api/user/vendorupdate", {
          email: ls.get("email"),
          managername: document.getElementById("managername").value,
          shopname: document.getElementById("shopname").value,
          contact: document.getElementById("contactv").value,
          opentime: document.getElementById("opentime").value,
          closetime: document.getElementById("closetime").value,
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      alert("Profile Updated");
      window.location.reload();
    }
  };

  //Use email from local storage top get necessary info from backend
  useEffect(() => {
    {
      //awaiting for backend
      ls.get("usertype") === 1
        ? axios 
            .post("/api/user/buyerdetails", {
              email: ls.get("email"),
            })
            .then((response) => {
              console.log(ls.get("email"));
              console.log(response.data);
              setName(response.data.name);
              setContact(response.data.contact);
              setAge(response.data.age);
              setBatch(response.data.batch);
              console.log(response.data.batch);
            })
            .catch(function (error) {
              console.log(error);
            })
        : axios
            .post("/api/user/vendordetails", {
              email: ls.get("email"),
            })
            .then((response) => {
              setManagername(response.data.managername);
              setShopname(response.data.shopname);
              setContact(response.data.contact);
              setOpentime(response.data.opentime);
              setClosetime(response.data.closetime);
            })
            .catch(function (error) {
              console.log(error);
            });
    }
  }, []);

  return (
    <List sx={style} component="nav" aria-label="mailbox folders">
      {ls.get("usertype") === 1 ? (
        <Box>
          <ListItem button>
            <ListItemText primary="Name:" />
            <TextField
              id="name"
              name="name"
              variant="outlined"
              defaultValue={name}
              InputProps={{
                readOnly: !edit,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Contact:" />
            <TextField
              id="contact"
              name="contact"
              variant="outlined"
              defaultValue={contact}
              InputProps={{
                readOnly: !edit,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Age:" />
            <TextField
              id="age"
              name="age"
              variant="outlined"
              defaultValue={age}
              InputProps={{
                readOnly: !edit,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Batch:" />
            <FormControl sx={{ m: 1, minWidth: 240 }} 
            disabled={!edit}
            >
              {/* <InputLabel id="demo-simple-select-disabled-label">Batch</InputLabel> */}
            <Select
              //appropriate width

              labelId="batch-select-label"
              id="batch"
              name="batch"
              defaultValue = {0}
              value={batch}
              // label="Batch"
              onChange={(e) => setBatch(e.target.value)}
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
          </ListItem>
          <Divider light />
          <br />
          <br />
          <br />
          <Stack spacing={5} direction="row">
            <Button
              variant="contained"
              color="primary"
              disabled={edit}
              onClick={handleedit}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!edit}
              onClick={handlesave}
            >
              Save Profile
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box>
          <ListItem button>
            <ListItemText primary="Manager Name:" />
            <TextField
              id="managername"
              name="managername"
              variant="outlined"
              defaultValue={managername}
              InputProps={{
                readOnly: !edit,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Shop Name:" />
            <TextField
              id="shopname"
              name="shopname"
              variant="outlined"
              defaultValue={shopname}
              InputProps={{
                readOnly: true,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Contact:" />
            <TextField
              id="contactv"
              name="contactv"
              variant="outlined"
              defaultValue={contact}
              InputProps={{
                readOnly: !edit,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Open Time:" />
            <TextField
              id="opentime"
              name="opentime"
              variant="outlined"
              defaultValue={opentime}
              InputProps={{
                readOnly: !edit,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Close Time:" />
            <TextField
              id="closetime"
              name="closetime"
              variant="outlined"
              defaultValue={closetime}
              InputProps={{
                readOnly: !edit,
              }}
              key={`${Math.floor(Math.random() * 1000)}-min`}
            />
          </ListItem>
          <Divider light />
          <br />
          <br />
          <br />
          <Stack spacing={5} direction="row">
            <Button
              variant="contained"
              color="primary"
              disabled={edit}
              onClick={handleedit}
            >
              Edit Profile
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!edit}
              onClick={handlesave}
            >
              Save Profile
            </Button>
          </Stack>
        </Box>
      )}
    </List>
  );
}
