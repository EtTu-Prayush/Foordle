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
import { send } from "emailjs-com";
function createData(
  _id,
  ItemName,
  PlacedTime,
  Quantity,
  BuyerName,
  AddOns,
  Status
) {
  return { _id, ItemName, PlacedTime, Quantity, BuyerName, AddOns, Status };
}

const initialrows = [
  createData("dgg", "Frozen yoghurt", 159, 6.0, "Me", 24, "ACCEPTED"),
  createData("dfdg", "Frozen yoghurt", 159, 6.0, "Me", 24, "PLACED"),
];

export default function BasicTable() {
  const [rows, setRows] = useState(initialrows);
  const [orders, setOrders] = useState([]);
  const [sortedorders, setSortedOrders] = useState([]);

  const [refresh, setRefresh] = useState(false);
  // Fill up the rows array with data.
  useEffect(() => {
    // Get all documents from the database for orders for the particular vendor
    axios
      .post("/api/vendor/showorders", {
        manageremail: ls.get("email"),
      })
      .then((response) => {
        setOrders(response.data);
        setSortedOrders(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handlenextstage = (props) => {
    //If there are 10 orders already at ACCEPTED stage or COOKING stage, then no more orders can be accepted.
    if (props.status === "PLACED") {
      if (orders.length >= 10) {
        var count = 0;
        for (var i = 0; i < orders.length; i++) {
          if (
            orders[i].status === "ACCEPTED" ||
            orders[i].status === "COOKING"
          ) {
            count++;
          }
        }
        if (count >= 10) {
          alert("No more orders can be accepted");
          return;
        }
      }
    }
    if (props.status === "PLACED") {
      send(
        "service_3zc0qdz",
        "template_ucab5cz",
        {
          from_name: props.vendoremail,
          shop_name: props.shopname,
          to_email: props.buyeremail,
          to_name: props.buyername,
          order_name: props.itemname,
        },
        "user_SVHvERvtGFxN2KIDkpKuM"
      )
        .then((response) => {
          console.log("SUCCESS!", response.status, response.text);
        })
        .catch((err) => {
          console.log("FAILED...", err);
        });
    }

    axios
      .post("/api/vendor/updateorderstatus", {
        _id: props._id,
        aorr: "a",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    setRefresh(!refresh);
  };

  const handlecancel = (props) => {
    send(
      "service_3zc0qdz",
      "template_cmskl4x",
      {
        from_name: props.vendoremail,
        shop_name: props.shopname,
        to_email: props.buyeremail,
        to_name: props.buyername,
        order_name: props.itemname,
      },
      "user_SVHvERvtGFxN2KIDkpKuM"
    )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      });
    axios
      .post("/api/vendor/updateorderstatus", {
        _id: props._id,
        aorr: "r",
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    //refund
    axios
      .post("/api/vendor/refund", {
        email: props.buyeremail,
        amount: props.totalprice,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    setRefresh(!refresh);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ItemName</TableCell>
            <TableCell align="right">PlacedTime</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">BuyerName</TableCell>
            <TableCell align="right">AddOns</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Status</TableCell>
            <TableCell align="right">Action</TableCell>
            <TableCell align="right">Cancel</TableCell>
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
              <TableCell align="right">
                {new Date(orders.placedtime).toLocaleString()}
              </TableCell>
              <TableCell align="right">{orders.quantity}</TableCell>
              <TableCell align="right">{orders.buyername}</TableCell>
              <TableCell align="right">
                {/* map the list of addonname */}
                {orders.addonname.map((addons) => (
                  <div key={addons}>{addons}</div>
                ))}
              </TableCell>
              <TableCell align="right">Rs.{orders.totalprice}</TableCell>
              <TableCell align="right">{orders.status}</TableCell>

              {orders.status === "REJECTED" ||
              orders.status === "READY FOR PICKUP" ||
              orders.status === "COMPLETED" ? (
                <TableCell align="right">
                  <Button variant="contained" color="primary" disabled>
                    Next Stage
                  </Button>
                </TableCell>
              ) : (
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlenextstage(orders)}
                  >
                    Next stage
                  </Button>
                </TableCell>
              )}
              {orders.status === "PLACED" ? (
                <TableCell align="right">
                  <Button
                    variant="contained"
                    onClick={() => handlecancel(orders)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              ) : (
                <TableCell align="right">
                  <Button variant="contained" disabled>
                    Cancel
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
