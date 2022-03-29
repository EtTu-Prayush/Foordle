import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import ls from "local-storage";
import axios from "axios";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Adding from "./AddItem";
import { createTheme } from '@mui/material/styles';
import { deepOrange } from "@mui/material/colors";
import { yellow } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: deepOrange,
    secondary: yellow,
  },
});

export default function ShowMenu() {
  const [rows, setRows] = useState([]);
  const [additem, setAddItem] = useState(false);

  const handleedit = (id) => {
    ls.set("editid", id);
    window.location.href = "/edit";
  };

  const handledelete = (id) => {
    axios
      .post('/api/vendor/deletefooditem/', {
        _id: id
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // Fill up the rows array with data.
  useEffect(() => {
    // Get all documents from the database for orders for the particular vendor
    axios
      .post("/api/vendor/fooditems", {
        manageremail: ls.get("email"),
      })
      .then((response) => {
        setRows(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddItem(true)}
          >
            Add Item
          </Button>
        </Stack>
      </Box>
      {additem ? <Adding /> : null}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ItemName</TableCell>
              <TableCell align="center">Image</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Veg/Non-Veg</TableCell>
              <TableCell align="center">Tags</TableCell>
              <TableCell align="center">AddOns</TableCell>
              <TableCell align="center"></TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
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
                <TableCell align="center">Rs.{row.price}</TableCell>
                <TableCell align="center">
                  {row.veg === true ? "Veg" : "Non-Veg"}
                </TableCell>
                <TableCell align="center">
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">List</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="List"
                    >
                      {row.tags.map((tag) => (
                        <MenuItem key={tag}>{tag}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">List</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={row.addonname}
                      label="List"
                    >
                      {/* //map addonname and addonprice simultaneously */}
                      {row.addonname.map((addon, index) => (
                        <MenuItem key={index}>
                          {addon}: Rs.
                          {row.addonprice[index]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell align="center">
                  {/* Edit row */}
                  <Button
                    variant="contained"
                    color="primary"
                    // pass current row to handleedit
                    onClick={() => handleedit(row._id)}                     
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell align="center">
                  <Button variant="contained"
                    color="secondary"
                    //handledelete
                    onClick={() => handledelete(row._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
