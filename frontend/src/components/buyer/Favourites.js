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

import Chip from "@mui/material/Chip";


export default function Fav() {
  const [menu, setMenu] = useState([]);
  const [sortedmenu, setSortedMenu] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");


  // Fill up the rows array with data.
  useEffect(() => {
    // Get all documents from the database for item for the particular vendor
    axios
      .post("/api/buyer/getfavourites", {
        email: ls.get("email"),
      })
      .then((response) => {
        setMenu(response.data);
        setSortedMenu(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handlefavourite = (key) => {
      axios
        .post("/api/buyer/removefavourite", {
            email: ls.get("email"),
            _id: key
        })
        .then((response) => {
            console.log(response);
            setRefresh(!refresh);
        })
        .catch((error) => {
            console.log(error);
        });
    };


  return (
    <div>
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
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedmenu.map((row) => (
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
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handlefavourite(row._id)}
                    >
                      Remove from Favourites
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}