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
import Rating from "@mui/material/Rating";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [sortedorders, setSortedOrders] = useState([]);
  const [rating, setRating] = useState(0);
  const [ratingbool, setRatingbool] = useState(false);
  const [refresh, setRefresh] = useState(false);

  // Fill up the rows array with data.
  useEffect(() => {
    // Get all documents from the database for orders for the particular vendor
    axios
      .post("/api/buyer/getallorders", {
        buyeremail: ls.get("email"),
      })
      .then((response) => {
        setOrders(response.data);
        // setRating(response.data.rating);
        setSortedOrders(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handlenextstage = (props) => {
    const _id = props;

    axios
      .post("/api/buyer/pickuporder", {
        _id: _id,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
      setRefresh(!refresh);
  };

  const handlerating = (a, b) => {
    setRatingbool(true);
    // console.log(rating);
    // console.log(document.getElementById("rating").value);
    axios
      .post("/api/buyer/ratethefood", {
        _id: a,
        rating: b,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
      setRefresh(!refresh);
      // window.location.reload();
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ItemName</TableCell>
            <TableCell align="center">PlacedTime</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">ShopName</TableCell>
            <TableCell align="center">AddOns</TableCell>
            <TableCell align="center">Total</TableCell>
            <TableCell align="center">Status</TableCell>
            <TableCell align="center">Action</TableCell>
            <TableCell align="center">Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((orders) => (
            <TableRow
              key={orders._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {orders.itemname}
              </TableCell>
              {/* Convert number to unix time */}
              <TableCell align="center">
                {new Date(orders.placedtime).toLocaleString()}
              </TableCell>
              <TableCell align="center">{orders.quantity}</TableCell>
              <TableCell align="center">{orders.shopname}</TableCell>
              <TableCell align="center">{orders.addonname}</TableCell>
              <TableCell align="center">Rs.{orders.totalprice}</TableCell>
              <TableCell align="center">{orders.status}</TableCell>

              {orders.status !== "READY FOR PICKUP" ? (
                <TableCell align="center">
                  <Button variant="contained" color="primary" disabled>
                    Pick Up
                  </Button>
                </TableCell>
              ) : (
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlenextstage(orders._id)}
                  >
                    Pick Up
                  </Button>
                </TableCell>
              )}
              {orders.status === "COMPLETED" && orders.rating === 0 ? (
                <TableCell align="center">
                  <Rating
                    name="simple-controlled"
                    // defaultValue={0}
                    id="rating"
                    defaultValue={0}
                    // value={rating}
                    onChange={(event, newValue) => {
                      //run useffect again
                      setRating(newValue);
                      handlerating(orders._id, newValue);
                    }}
                    // disabled={ratingbool}
                  />
                </TableCell>
              ) : (
                <TableCell align="center">
                  <Rating name="disabled" value={orders.rating} disabled />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
