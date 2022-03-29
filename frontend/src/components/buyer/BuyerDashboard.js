import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import ls, { set } from "local-storage";
import axios from "axios";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { createTheme } from "@mui/material/styles";
import { deepOrange } from "@mui/material/colors";
import { yellow } from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Rating from "@mui/material/Rating";
import Fav from "./Favourites";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";

const Fuse = require("fuse.js");

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function Print() {
  return <div>Meh...</div>;
}

function checktime(i) {
  if(i < 10) //single digit
  {
    i = "0" + i;

  }
  return i;
}
var f = 0;
var array0 = [];
var array1 = [];
var array2 = [];
var array3 = [];
var shoptimings = []; //shopname, openingtime, closingtime

export default function Myitem() {
  const [menu, setMenu] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const [search, setSearch] = useState("");
  const [minprice, setMinPrice] = useState(0);
  const [maxprice, setMaxPrice] = useState(1000);

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [vegtrue, setVegtrue] = useState(true);
  const [nonvegtrue, setNonvegtrue] = useState(true);

  const [shopnames, setShopnames] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedshopnames, setSelectedshopnames] = useState([]);
  const [selectedtags, setSelectedtags] = useState([]);

  const [wallet, setWallet] = useState(0);

  const [meh, setMeh] = useState(false);

  const handleClickOpen = (props) => {
    // console.log(props);
    //set selected value as props
    setSelectedValue(props);
    console.log(selectedValue);
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  // Fill up the rows array with data.
  useEffect(() => {
    // Get all documents from the database for item for the particular vendor
    axios
      .post("/api/buyer/showmenu")
      .then((res) => {
        setMenu(res.data);
        array0 = res.data; //original
        array1 = res.data; //original open
        //array2 = res.data; // original open filtered
        //array3 = res.data;

        setShopnames(res.data.map((item) => item.shopname));
        //Remove duplicates
        const shopnames = [...new Set(res.data.map((item) => item.shopname))];
        setShopnames(shopnames);
        //List of tags
        var arrtags = [];
        res.data.forEach((item) => {
          for (var i = 0; i < item.tags.length; i++) {
            arrtags.push(item.tags[i]);
          }
        });
        //Remove duplicates from tags
        const xtags = [...new Set(arrtags)];
        setTags(xtags);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post("/api/buyer/walletdetails", {
        email: ls.get("email"),
      })
      .then((res) => {
        setWallet(res.data.wallet);
        ls.set("wallet", res.data.wallet);
      })
      .catch((err) => {
        console.log(err);
      });

    //Save opening and closing time of shops in arrays
    axios
      .post("/api/buyer/shoptimings")
      .then((res) => {
        shoptimings = res.data;
        console.log(shoptimings);
      })
      .catch((err) => {
        console.log(err);
      });

    handlefilter(0);
    // setRefresh(true);
    // while(refresh === false){
    //   console.log("waiting");
    // }
  }, [refresh]);

  // setRefresh(true);
  const handlefavourite = (key) => {
    //add to favourites
    axios
      .post("/api/buyer/addfavourite", {
        _id: key,
        email: ls.get("email"),
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlefilter = (props) => {
    //filter according to search keyword irrespective of case
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    h = checktime(h);
    m = checktime(m);
    var time = h + ":" + m;

    array1 = array1.filter((item) => {
      var flag = false;
      for (var i = 0; i < shoptimings.length; i++) {
        if (
          item.manageremail === shoptimings[i].email &&
          shoptimings[i].opentime <= time &&
          shoptimings[i].closetime >= time
        ) {
          flag = true;
        }
      }
      return flag;
    });

    array3 = array0.filter((item) => !array1.includes(item));

    array2 = array1;

    // const fuse = new Fuse(array2, {
    //   keys: ["itemname"],
    // })

    if (search !== "") {
      //implement fuzzy search
      // array2 = fuse.search(search);
      array2 = array2.filter((item) =>
        item.itemname.toLowerCase().includes(search.toLowerCase())
      );
    }

    //filter according to veg and nonveg
    if (vegtrue === true && nonvegtrue === false) {
      array2 = array2.filter((item) => item.veg === true);
    } else if (vegtrue === false && nonvegtrue === true) {
      array2 = array2.filter((item) => item.veg === false);
    }
    // //filter according to price
    if (minprice !== "" && maxprice !== "") {
      array2 = array2.filter(
        (item) => item.price >= minprice && item.price <= maxprice
      );
    } else if (minprice !== "") {
      array2 = array2.filter((item) => item.price >= minprice);
    } else if (maxprice !== "") {
      array2 = array2.filter((item) => item.price <= maxprice);
    } else if (minprice === "" && maxprice === "") {
      array2 = array2.filter((item) => item.price >= 0 && item.price <= 100000);
    }
    // //filter according to shopname
    if (selectedshopnames.length !== 0) {
      array2 = array2.filter((item) =>
        selectedshopnames.includes(item.shopname)
      );
    }
    //filter accoring to tags
    if (selectedtags.length !== 0) {
      array2 = array2.filter((item) => {
        var flag = false;
        for (var i = 0; i < item.tags.length; i++) {
          if (selectedtags.includes(item.tags[i])) {
            flag = true;
          }
        }
        return flag;
      });
    }

    if (props === 1)
      //ascending by price
      array2 = array2.sort((a, b) => a.price - b.price);
    else if (props === 2)
      //descending by price
      array2 = array2.sort((a, b) => b.price - a.price);
    else if (props === 3)
     { //ascending by rating
      array2 = array2.sort((a, b) => 
        //take care of division by zero
        {if(a.ratingcount === 0)
          return -1;
        else if(b.ratingcount === 0)
          return 1;
        else
          return a.rating/a.ratingcount - b.rating/b.ratingcount;
        })}
    else if (props === 4)
      //descending by rating
      {
        array2 = array2.sort((a, b) => 
        //take care of division by zero
        {if(a.ratingcount === 0)
          return 1;
        else if(b.ratingcount === 0)
          return -1;
        else
          return b.rating/b.ratingcount - a.rating/a.ratingcount;
        })}

    //   const fuse1 = new Fuse(array3, {
    //     keys: ["itemname"],
    // })

    if (search !== "") {
      //implement fuzzy search
      // const result = fuse1.search(search);
      // //store all result.item in array3
      // for (var i = 0; i < result.length; i++) {
      //   array3.push(result[i].item);
      array3 = array3.filter((item) =>
        item.itemname.toLowerCase().includes(search.toLowerCase())
      );
    }

    //filter according to veg and nonveg
    if (vegtrue === true && nonvegtrue === false) {
      array3 = array3.filter((item) => item.veg === true);
    } else if (vegtrue === false && nonvegtrue === true) {
      array3 = array3.filter((item) => item.veg === false);
    }
    // //filter according to price
    if (minprice !== "" && maxprice !== "") {
      array3 = array3.filter(
        (item) => item.price >= minprice && item.price <= maxprice
      );
    } else if (minprice !== "") {
      array3 = array3.filter((item) => item.price >= minprice);
    } else if (maxprice !== "") {
      array3 = array3.filter((item) => item.price <= maxprice);
    } else if (minprice === "" && maxprice === "") {
      array3 = array3.filter((item) => item.price >= 0 && item.price <= 100000);
    }
    // //filter according to shopname
    if (selectedshopnames.length !== 0) {
      array3 = array3.filter((item) =>
        selectedshopnames.includes(item.shopname)
      );
    }
    //filter accoring to tags
    if (selectedtags.length !== 0) {
      array3 = array3.filter((item) => {
        var flag = false;
        for (var i = 0; i < item.tags.length; i++) {
          if (selectedtags.includes(item.tags[i])) {
            flag = true;
          }
        }
        return flag;
      });
    }

    if (props === 1)
      //ascending by price
      array3 = array3.sort((a, b) => a.price - b.price);
    else if (props === 2)
      //descending by price
      array3 = array3.sort((a, b) => b.price - a.price);
    else if (props === 3)
      //ascending by rating
      {
        array3 = array3.sort((a, b) => 
        //take care of division by zero
        {if(a.ratingcount === 0)
          return -1;
        else if(b.ratingcount === 0)
          return 1;
        else
          return a.rating/a.ratingcount - b.rating/b.ratingcount;
        })}
    else if (props === 4)
      //descending by rating
      {
        array3 = array3.sort((a, b) =>
        //take care of division by zero
        {if(a.ratingcount === 0)
          return 1;
        else if(b.ratingcount === 0)
          return -1;
        else
          return b.rating/b.ratingcount - a.rating/a.ratingcount;
        })}
    // Filter out only open shops
    //Store rest of the data in array3
    setMenu(array2);
    //setSortedMenu(array2);
    // setSortedMenu2(array3);
  };
  return (
    // Dont render until refresh is true
    //array2 and array3 is empty

    <div>
      <div>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="right"
          justifyContent="right"
          p={1}
          m={1}
          css={{ maxWidth: "100%" }}
        >
          <TextField
            id="outlined-basic"
            label="Wallet"
            variant="filled"
            value={wallet}
            InputProps={{
              readOnly: true,
            }}
          />
          
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="right"
          justifyContent="right"
          p={1}
          m={1}
          css={{ maxWidth: "100%" }}
        >
        <Button variant="contained" color="primary" 
          onClick={() => {
            handlefilter(0);
          }}>
            Set/Reset
          </Button>
        </Box>
      </div>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Favourites
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Fav />
      </div>
      {/* Filters */}

      <div>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            //Search for items which includes the word and refresh the menu
            //lowercase
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />

          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={vegtrue}
                  label="Veg"
                  //pass checkbox value to handlecheckboxes
                  onChange={(e) => {
                    setVegtrue(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Veg"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={nonvegtrue}
                  label="Non-Veg"
                  onChange={(e) => {
                    setNonvegtrue(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label="Non-Veg"
            />
          </FormGroup>
        </Box>
        <br />
        {/* Price range having minimum and maximum values */}
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch", height: "7ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="outlined-basic"
            label="Minimum Price"
            variant="outlined"
            type="number"
            onChange={(e) => {
              setMinPrice(e.target.value);
            }}
          />
          <TextField
            id="outlined-basic"
            label="Maximum Price"
            variant="outlined"
            type="number"
            onChange={(e) => {
              setMaxPrice(e.target.value);
            }}
          />
        </Box>
        {/* <br /> */}
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          {/* Create multiselect for selecting shops */}
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              Select Shop
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              defaultValue={""}
              multiple
              value={selectedshopnames}
              onChange={(e) => {
                setSelectedshopnames(e.target.value);
              }}
              label="Select Shop"
            >
              {shopnames.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Create multiselect for selecting tags */}
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              Select Tags
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              defaultValue={""}
              multiple
              value={selectedtags}
              onChange={(e) => {
                setSelectedtags(e.target.value);
              }}
              label="Select Tags"
            >
              {tags.map((item) => {
                return (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch", height: "7ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              handlefilter(0);
            }}
          >
            Filter
          </Button>
        </Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch", height: "7ch" },
          }}
          noValidate
          autoComplete="off"
        >
          {/* Ascending by price button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handlefilter(1);
            }}
          >
            Ascending by Price
          </Button>
          {/* Descending by price button */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handlefilter(2);
            }}
          >
            Descending by Price
          </Button>
          {/* Ascending by rating */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handlefilter(3);
            }}
          >
            Ascending by Rating
          </Button>
          {/* Descending by rating */}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handlefilter(4);
            }}
          >
            Descending by Rating
          </Button>
        </Box>
      </div>
      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Menu
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      {/* Menu */}
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ItemName</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">ShopName</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Veg/Non-Veg</TableCell>
                <TableCell align="center">Tags</TableCell>
                {/* Buying Stages */}
                <TableCell align="center">AddOns</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {array2.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.itemname}
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={row.image}
                      alt="food"
                      style={{ width: "120px", height: "100px" }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.shopname}</TableCell>
                  <TableCell align="center">Rs.{row.price}</TableCell>
                  <TableCell align="center">
                    {row.veg === true ? "Veg" : "Non-Veg"}
                  </TableCell>
                  <TableCell align="center">
                    {row.tags.map((tag) => (
                      <div spacing={2} key={tag}>
                        <Stack spacing={2}>
                          <Chip label={tag} key={tag} />
                        </Stack>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {row.addonname.map((addon, index) => (
                      <div spacing={2} key={index}>
                        <Stack spacing={2}>
                          {/* Addonname and addonprice */}
                          <Chip
                            label={`${addon}: Rs.${row.addonprice[index]}`}
                            key={index}
                          />
                        </Stack>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {/* Rating */}
                    <Rating
                      name="read-only"
                      //value = floor(row.rating)/row.ratingcount
                      value={
                        row.ratingcount === 0
                          ? 0
                          : Math.floor(row.rating / row.ratingcount)
                      }
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handlefavourite(row._id)}
                    >
                      Add to Favourites
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleClickOpen(row._id)}
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {open ? (
          <SimpleDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
          />
        ) : null}
      </Box>
      {/* Unavailable */}

      <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar variant="dense">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Menu (Not Open)
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
      {/* Menu */}
      <Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ItemName</TableCell>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">ShopName</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Veg/Non-Veg</TableCell>
                <TableCell align="center">Tags</TableCell>
                {/* Buying Stages */}
                <TableCell align="center">AddOns</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {array3.map((row) => (
                <TableRow
                  key={row._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.itemname}
                  </TableCell>
                  <TableCell align="center">
                    <img
                      src={row.image}
                      alt="food"
                      style={{ width: "120px", height: "100px" }}
                    />
                  </TableCell>
                  <TableCell align="center">{row.shopname}</TableCell>
                  <TableCell align="center">Rs.{row.price}</TableCell>
                  <TableCell align="center">
                    {row.veg === true ? "Veg" : "Non-Veg"}
                  </TableCell>
                  <TableCell align="center">
                    {row.tags.map((tag) => (
                      <div spacing={2} key={tag}>
                        <Stack spacing={2}>
                          <Chip label={tag} key={tag} />
                        </Stack>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {row.addonname.map((addon, index) => (
                      <div spacing={2} key={index}>
                        <Stack spacing={2}>
                          {/* Addonname and addonprice */}
                          <Chip
                            label={`${addon}: Rs.${row.addonprice[index]}`}
                            key={index}
                          />
                        </Stack>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {/* Rating */}
                    <Rating
                      name="read-only"
                      value={
                        row.ratingcount === 0
                          ? 0
                          : Math.floor(row.rating / row.ratingcount)
                      }
                      readOnly
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handlefavourite(row._id)}
                    >
                      Add to Favourites
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      disabled
                      onClick={() => handleClickOpen(row._id)}
                    >
                      Buy
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {open ? (
          <SimpleDialog
            selectedValue={selectedValue}
            open={open}
            onClose={handleClose}
          />
        ) : null}
      </Box>
    </div>
  );
}

function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [quantity, setQuantity] = useState(1);
  const [itemname, setItemname] = useState("");
  const [shopname, setShopname] = useState("");
  const [vendoremail, setVendoremail] = useState("");
  const [price, setPrice] = useState(0);
  const [addonname, setAddonname] = useState([]);
  const [addonprice, setAddonprice] = useState([]);
  const [selectedaddonname, setSelectedaddonname] = useState([]);
  const [selectedaddonprice, setSelectedaddonprice] = useState([]);
  const [totalprice, setTotalprice] = useState(0);
  const handleClose = () => {
    onClose();
  };
  const handlebuy = () => {
    //get time in int
    const time = new Date().getTime();
    // convert quantity to int
    const q = parseInt(quantity);
    var p = parseInt(price);
    // run loop on addonprice
    for (let i = 0; i < selectedaddonprice.length; i++) {
      // convert addonprice to int
      const ap = parseInt(selectedaddonprice[i]);
      // add addonprice to p
      p = p + ap;
    }
    // add quantity to p
    p = p * q;
    if (p > ls.get("wallet")) {
      alert("Insufficient Balance");
      onClose();
    } else {
      console.log({
        itemname: itemname,
        shopname: shopname,
        price: price,
        addonname: selectedaddonname,
        addonprice: selectedaddonprice,
        quantity: q,
        totalprice: p,
        time: time,
      });
      axios
        .post("/api/buyer/orderitem", {
          item_id: selectedValue,
          itemname: itemname,
          vendoremail: vendoremail,
          shopname: shopname,
          buyeremail: ls.get("email"),
          buyername: ls.get("username"),
          placedtime: time,
          quantity: q,
          addonname: selectedaddonname,
          addonprice: selectedaddonprice,
          totalprice: p,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      //deduct money
      axios
        .post("/api/buyer/deductmoney", {
          email: ls.get("email"),
          amount: p,
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
      onClose();
    }
  };

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    axios
      .post("/api/buyer/getitem", {
        _id: selectedValue,
      })
      .then((res) => {
        setItemname(res.data.itemname);
        setShopname(res.data.shopname);
        setPrice(res.data.price);
        setAddonname(res.data.addonname);
        setAddonprice(res.data.addonprice);
        setVendoremail(res.data.manageremail);
      })
      .catch((err) => {
        console.log(err);
      });
    if (selectedValue === "" || selectedValue === undefined) {
      setRefresh(!refresh);
    }
  }, [refresh]);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>A few more steps...</DialogTitle>
      <br></br>
      {/* Details of the product */}
      {/* {selectedValue} */}
      <Box>
        <Stack spacing={2}>
          <TextField
            id="outlined-basic"
            label="ItemName"
            variant="outlined"
            value={itemname}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-basic"
            label="ShopName"
            variant="outlined"
            value={shopname}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            value={price}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            id="quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            defaultValue={1}
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
          />
          {/* Multi select AddOns */}
          <FormControl variant="outlined">
            <InputLabel id="demo-simple-select-outlined-label">
              AddOns
            </InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              multiple
              value={selectedaddonname}
              onChange={(e) => {
                setSelectedaddonname(e.target.value);
                // Set selectedaddonprice as the same index as selectedaddonname
                setSelectedaddonprice(
                  e.target.value.map((addon) => {
                    return addonprice[addonname.indexOf(addon)];
                  })
                );
              }}
              label="AddOns"
              variant="outlined"
            >
              {addonname.map((addon) => (
                <MenuItem key={addon} value={addon}>
                  {addon}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <br></br>
      <Button variant="contained" color="primary" onClick={handlebuy}>
        Buy
      </Button>
      {/* Set quantity to order */}
    </Dialog>
  );
}
