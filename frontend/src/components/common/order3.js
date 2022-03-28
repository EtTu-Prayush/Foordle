import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import Cancel from "@mui/icons-material/Cancel";
import emailjs from "@emailjs/browser";

const UsersList = (props) => {
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState("PLACED");
  const [acceptOrder, setAccept] = useState(0);
  const [cookOrder, setCook] = useState(0);

  useEffect(() => {
    console.log(localStorage.getItem("email"));
    axios
      .post("api/order/getstatecount", {
        vendor_email: localStorage.getItem("email"),
      })
      .then((res) => {
        console.log(res.data);
        setAccept(res.data.accept);
        setCook(res.data.cooking);
      });
  }, [acceptOrder, cookOrder]);

  const handleChange = (event) => {
    event.preventDefault();
    const email = localStorage.getItem("email");
    let pending = 0,
      complete = 0;
    if (event.target.value === "REJECTED") {
      event.target.disabled = true;
    } else {
      if (event.target.value === "PLACED") {
        // increase the placed order count
        if (acceptOrder + cookOrder < 10) {
          // accept order , increase the pending order count
          event.target.value = "ACCEPTED";
          pending = 1;
        } else {
          alert("Can have at max 10 orders in accepted or cook stage !!");
        }
      } else if (event.target.value === "ACCEPTED") {
        event.target.value = "COOKING";
      } else if (event.target.value === "COOKING") {
        event.target.value = "READY FOR PICKUP";
        // remove the pending order thing from pending_order
        pending = -1;
        // add the completed order count
      }
    }

    console.log(event.target.id);
    console.log(event.target.value);

    // changes the state of the
    axios
      .put("api/order/changestate", {
        _id: event.target.id,
        state: event.target.value,
      })
      .then((res) => {
        console.log(event.target.myText.vendor_email);
        console.log(event.target.myText.buyer_email);

        axios
          .put("api/vendor/updateCount", {
            vendor_email: email,
            pending: pending,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    window.location.reload();
  };

  function handleReject(event) {
    event.preventDefault();

    console.log(event.target.id);
    console.log(event.target.value);

    axios
      .put("api/order/changestate", {
        _id: event.target.id,
        state: "REJECTED",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    window.location.reload();
  }

  useEffect(() => {
    axios
      .post("api/order/getorder", {
        vendor_email: localStorage.getItem("email"),
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell> Sr No.</TableCell>
                  <TableCell>Order Name</TableCell>
                  <TableCell>Placed By</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Placed Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Add-Ons</TableCell>
                  <TableCell>Update Status</TableCell>
                  <TableCell>Reject Order</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, ind) => (
                  <TableRow
                    bgcolor={(order.status === "REJECTED"
                      ? "lightgrey"
                      : order.status === "COMPLETED"
                      ? "lightgreen"
                      : ""
                    ).toString()}
                    key={ind}
                  >
                    <TableCell>{ind}</TableCell>
                    <TableCell>{order.item_name}</TableCell>
                    <TableCell id={order._id + "buyer_email"}>
                      {order.buyer_email}
                    </TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.placed_time}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {order.addon_name.map((name, ind) => (
                        <div key={ind}>{name}</div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        id={order._id}
                        value={order.status}
                        disabled={
                          order.status === "COMPLETED" ||
                          order.status === "REJECTED" ||
                          order.status === "READY FOR PICKUP" ||
                          (acceptOrder + cookOrder >= 10 &&
                            order.status === "PLACED")
                            ? true
                            : false
                        }
                        onClick={(event) => {
                          event.preventDefault();
                          const email = localStorage.getItem("email");
                          let pending = 0,
                            complete = 0;
                          if (event.target.value === "REJECTED") {
                            event.target.disabled = true;
                          } else {
                            if (event.target.value === "PLACED") {
                              // increase the placed order count
                              if (acceptOrder + cookOrder < 10) {
                                // accept order , increase the pending order count
                                event.target.value = "ACCEPTED";
                                pending = 1;
                              } else {
                                alert(
                                  "Can have at max 10 orders in accepted or cook stage !!"
                                );
                              }
                            } else if (event.target.value === "ACCEPTED") {
                              event.target.value = "COOKING";
                            } else if (event.target.value === "COOKING") {
                              event.target.value = "READY FOR PICKUP";
                              // remove the pending order thing from pending_order
                              pending = -1;
                              // add the completed order count
                            }
                          }

                          console.log(event.target.id);
                          console.log(event.target.value);
                          console.log(order.vendor_shop);
                          console.log(order.buyer_email);

                          // changes the state of the
                          axios
                            .put("api/order/changestate", {
                              _id: event.target.id,
                              state: event.target.value,
                            })
                            .then((res) => {
                              axios
                                .put(
                                  "api/vendor/updateCount",
                                  { vendor_email: email, pending: pending }
                                )
                                .then((res) => {
                                  console.log(res);
                                  if (event.target.value === "ACCEPTED") {
                                    emailjs
                                      .send(
                                        "service_lg4ccz8",
                                        "template_hno068a",
                                        {
                                          status: "ACCEPTED",
                                          shop_name: order.vendor_shop,
                                          buyer: order.buyer_email,
                                        },
                                        "user_VFqheCHMAXwwWYzw2BulN"
                                      )
                                      .then(
                                        (result) => {
                                          if (result.text === "OK") {
                                            alert(
                                              "SENT MAIL CONFIRMATION !! ORDER ACCEPTED"
                                            );
                                            window.location.reload();
                                          } else {
                                            console.log(result.text);
                                            alert("COULDNOT SEND EMAIL");
                                            window.location.reload();
                                          }
                                        },
                                        (error) => {
                                          alert("COULDNOT SEND EMAIL");
                                          window.location.reload();
                                          console.log(error.text);
                                        }
                                      );
                                  }
                                })
                                .catch((err) => {
                                  console.log(err);
                                });

                              console.log(res);
                            })
                            .catch((err) => {
                              console.log(err);
                            });

                          if (event.target.value !== "ACCEPTED")
                            window.location.reload();
                        }}
                      >
                        Change State
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        fullWidth
                        id={order._id}
                        value={order.status}
                        variant="contained"
                        color="primary"
                        disabled={order.status === "PLACED" ? false : true}
                        onClick={(event) => {
                          event.preventDefault();

                          console.log(event.target.id);
                          console.log(event.target.value);

                          axios
                            .put("api/order/changestate", {
                              _id: event.target.id,
                              state: "REJECTED",
                            })
                            .then((res) => {
                              console.log(res);

                              axios
                                .put(
                                  "api/buyer/add_wallet_balance",
                                  {
                                    email: order.buyer_email,
                                    wallet_balance: order.bill,
                                  }
                                )
                                .then((res) => {
                                  emailjs
                                    .send(
                                      "service_lg4ccz8",
                                      "template_hno068a",
                                      {
                                        status: "REJECTED",
                                        shop_name: order.vendor_shop,
                                        buyer: order.buyer_email,
                                      },
                                      "user_VFqheCHMAXwwWYzw2BulN"
                                    )
                                    .then(
                                      (result) => {
                                        if (result.text === "OK") {
                                          alert(
                                            "SENT MAIL CONFIRMATION !! ORDER REJECTED"
                                          );
                                          window.location.reload();
                                        } else {
                                          console.log(result.text);
                                          alert("COULDNOT SEND EMAIL");
                                          window.location.reload();
                                        }
                                      },
                                      (error) => {
                                        alert("COULDNOT SEND EMAIL");
                                        window.location.reload();
                                        console.log(error.text);
                                      }
                                    );
                                })
                                .catch((err) => {
                                  alert("Failed !!");
                                  console.log(err);
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                            });
                        }}
                      >
                        <Cancel></Cancel>REJECT
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default UsersList;
