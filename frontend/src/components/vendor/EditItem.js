import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';  
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ls from "local-storage";
import Box from "@mui/material/Box";
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { width } from '@mui/system';
import { MenuItem } from "@mui/material";
import Select from "@mui/material/Select";

const style = {
  width: '100%',
  maxWidth: 360,
  bgcolor: 'background.paper',
};

export default function Editing() {
     const [itemname, setItemname] = React.useState("");
     const [price, setPrice] = React.useState(0);
     const [veg, setVeg] = React.useState(true);
     const [tags, setTags] = React.useState([]);
     const [addonname, setAddonname] = React.useState([]);
     const [addonprice, setAddonprice] = React.useState([]);

      const handlesave = () => {

        { document.getElementById("veg").value === "Veg" ? setVeg(true) : setVeg(false) }
        var xtags = document.getElementById("tags").value.split(",");
        var xaddonname = document.getElementById("addonname").value.split(",");
        var xaddonprice = document.getElementById("addonprice").value.split(",");
        axios.post('/api/vendor/editfooditem', {
            _id: ls.get('editid'),
            itemname: document.getElementById("itemname").value,
            price: document.getElementById("price").value,
            veg: veg,
            tags: xtags,
            addonname: xaddonname,
            addonprice: xaddonprice,
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
        alert("Item edited successfully");
        window.location = "/menu";
    };

      //Use edit id from local storage
    useEffect(() => {
            axios.post('/api/vendor/fooditem', {
                _id: ls.get('editid')
            })
            .then(function (response) {
                console.log(response);
                setItemname(response.data.itemname);
                setPrice(response.data.price);
                setVeg(response.data.veg);
                setTags(response.data.tags);
                setAddonname(response.data.addonname);
                setAddonprice(response.data.addonprice);
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);


  return (
    <List sx={style} component="nav" aria-label="mailbox folders">
        <Stack
        spacing={5}
        direction="row"
        >
      <Button
        variant="contained"
        color="primary"
        onClick={ () => { window.location = "/menu"; } }
        >
        Back
        </Button>
      </Stack>
      <br/>
      <br/>
    <Box>
      <ListItem button>
        <ListItemText primary="Item Name:"/>
        <TextField 
            id='itemname'
            itemname='itemname'
            variant="outlined"
            defaultValue={itemname}
            key={`${Math.floor((Math.random() * 1000))}-min`}
        />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary="Price:" />
        <TextField
            id='price'
            itemname='price'
            variant="outlined"
            defaultValue={price}
            key={`${Math.floor((Math.random() * 1000))}-min`}
        />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary="Veg/Non Veg:" />
        <Select
                  labelId="demo-simple-select-label"
                  id="veg"
                  value={veg ? "Veg" : "Non-Veg"}
                  onChange={ (e) => {
                    if(e.target.value === "Veg") {
                      setVeg(true);
                    }
                    else {
                      setVeg(false);
                    }
                  }}
                >
                  <MenuItem value="Veg">Veg</MenuItem>
                  <MenuItem value="Non-Veg">Non-Veg</MenuItem>
                </Select>
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary="Tags:" />
        <TextField
            id='tags'
            itemname='tags'
            variant="outlined"
            defaultValue={tags}
            key={`${Math.floor((Math.random() * 1000))}-min`}
        />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary="Addon Name:" />
        <TextField
            id='addonname'
            itemname='addonname'
            variant="outlined"
            defaultValue={addonname}
            key={`${Math.floor((Math.random() * 1000))}-min`}
        />
      </ListItem>
      <Divider />
      <ListItem button>
        <ListItemText primary="Addon Price:" />
        <TextField
            id='addonprice'
            itemname='addonprice'
            variant="outlined"
            defaultValue={addonprice}
            key={`${Math.floor((Math.random() * 1000))}-min`}
        />
      </ListItem>
      <Divider light />
      <br/>
      <br/>
      <Stack
        spacing={5}
        direction="row"
        >
        <Button
        variant="contained"
        color="primary"
        onClick={handlesave}
        >
          Save
        </Button>
      </Stack>
    </Box>
    </List>
  );
}
