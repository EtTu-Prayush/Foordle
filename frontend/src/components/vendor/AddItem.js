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
import { useState } from "react";
import { useEffect } from "react";
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

export default function Adding() {
  const [itemname, setItemname] = React.useState("");
  const [price, setPrice] = React.useState(0);
  const [image, setImage] = React.useState("");
  const [veg, setVeg] = React.useState(true);
  const [tags, setTags] = React.useState([]);
  const [addonname, setAddonname] = React.useState([]);
  const [addonprice, setAddonprice] = React.useState([]);

  //get shopname
  const [shopname, setShopname] = React.useState("");
  useEffect(() => {
    axios
      .post("/api/vendor/getshopname", {
        email: ls.get("email")
      })
      .then(res => {
        setShopname(res.data.shopname);
        // console.log(shopname);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const handleitemname = (event) => {
    setItemname(event.target.value);
  };
  const handleprice = (event) => {
    setPrice(event.target.value);
  };
  const handleveg = (event) => {
    if (event.target.value === "Veg") {
      setVeg(true);
    } else {
      setVeg(false);
    }
  };
  const handletags = (event) => {
    //comma separated
    var tags = event.target.value.split(",");
    setTags(tags);

  };
  const handleaddonname = (event) => {
    //comma separated
    var addonname = event.target.value.split(",");
    setAddonname(addonname);
  };
  const handleaddonprice = (event) => {
    //comma separated
    var addonprice = event.target.value.split(",");
    //convert to int
    for (var i = 0; i < addonprice.length; i++) {
      addonprice[i] = parseInt(addonprice[i]);
    }
    setAddonprice(addonprice);    
  };
  const handleRegistration = (event) => {
    event.preventDefault();
    console.log(itemname, price, veg, tags, addonname, addonprice, shopname);

    axios
      .post("/api/vendor/addfooditem", {
        manageremail: ls.get("email"),
        itemname: itemname,
        price: price,
        veg: veg,
        tags: tags,
        addonname: addonname,
        addonprice: addonprice,
        shopname: shopname,
      })
      .then((response) => { 
        console.log(response);
        alert("Item added successfully.");
        window.location.reload();
      }
      )
      .catch((error) => {
        console.log(error);
        alert("Error adding item. Item may already exist.");
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
          <Typography component="h1" variant="h5">
            Fill Details
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
                  name="itemname"
                  required
                  fullWidth
                  id="itemname"
                  label="ItemName"
                  autoFocus
                  onChange={handleitemname}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  id="price"
                  label="Price"
                  name="price"
                  autoComplete="price"
                  onChange={handleprice}
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={veg ? "Veg" : "Non-Veg"}
                  onChange={handleveg}
                >
                  <MenuItem value="Veg">Veg</MenuItem>
                  <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12}>
                Please enter tags and addons separated by comma (',')
                </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="tags"
                  label="Tags"
                  name="tags"
                  autoComplete="tags"
                  onChange={handletags}
                />
              </Grid>
              <Grid item xs={12} >
              Make sure to keep name and price in the same order :)
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="addonname"
                  label="AddonNames"
                  name="addonname"
                  autoComplete="addonname"
                  onChange={handleaddonname}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="addonprice"
                  label="AddonPrice"
                  name="addonprice"
                  autoComplete="addonprice"
                  onChange={handleaddonprice}
                />
              </Grid>
              <Grid item xs={12}></Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

