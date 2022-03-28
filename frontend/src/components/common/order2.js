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
import Cancel from '@mui/icons-material/Cancel';
import emailjs from 'emailjs-com';
const UsersList = (props) => {

    const [orders, setOrders] = useState([]);
    const [state, setState] = useState("PLACED");
    const [acceptOrder, setAccept] = useState(0);
    const [cookOrder, setCook] = useState(0);

    useEffect(() => {
        console.log(localStorage.getItem("email"));
        axios
            .post("api/order/getstatecount", { vendor_email: localStorage.getItem("email") })
            .then((res) => {
                console.log(res.data);
                setAccept(res.data.accept);
                setCook(res.data.cooking);
            })
    }, [acceptOrder, cookOrder]);

    const handleChange = (event) => {
        event.preventDefault();
        const email = localStorage.getItem("email");
        let pending = 0, complete = 0
        if (event.target.value === "REJECTED") {
            event.target.disabled = true;
        } else {
            if (event.target.value === "PLACED") {
                // increase the placed order count
                if (acceptOrder + cookOrder < 10) {
                    // accept order , increase the pending order count
                    event.target.value = "ACCEPTED";
                    pending = 1;
                }
                else {
                    alert("Can have at max 10 orders in accepted or cook stage !!")
                }
            }
            else if (event.target.value === "ACCEPTED") {
                event.target.value = "COOKING";
            }
            else if (event.target.value === "COOKING") {
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
            .put("api/order/changestate", { _id: event.target.id, state: event.target.value })
            .then((res) => {
                console.log(event.target.myText.vendor_email)
                console.log(event.target.myText.buyer_email)

                axios
                    .put("api/vendor/updateCount", { vendor_email: email, pending: pending })
                    .then((res) => {
                        console.log(res)
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
            .put("api/order/changestate", { _id: event.target.id, state: "REJECTED" })
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
            .post("api/order/getorder", { vendor_email: localStorage.getItem("email") })
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
                                    <TableCell>
                                        Placed By
                                    </TableCell>
                                    <TableCell>
                                        Quantity
                                    </TableCell>
                                    <TableCell>
                                        Placed Time
                                    </TableCell>
                                    <TableCell>
                                        Status
                                    </TableCell>
                                    <TableCell>
                                        Add-Ons
                                    </TableCell>
                                    <TableCell>
                                        Update Status
                                    </TableCell>
                                    <TableCell>
                                        Reject Order
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, ind) => (
                                    <TableRow
                                        bgcolor={(order.status === "REJECTED" ? "lightgrey" : order.status === "COMPLETED" ? "lightgreen" : "").toString()}
                                        key={ind} >
                                        <TableCell>{ind}</TableCell>
                                        <TableCell>{order.item_name}</TableCell>
                                        <TableCell id={order._id + "buyer_email"}>{order.buyer_email}</TableCell>
                                        <TableCell>{order.quantity}</TableCell>
                                        <TableCell>{order.placed_time}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.addon_name.map((name, ind) => (
                                            <div key={ind}>
                                                {name}
                                            </div>
                                        ))
                                        }
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                id={order._id}
                                                value={order.status}
                                                disabled={order.status === "COMPLETED" || order.status === "REJECTED" || order.status === "READY FOR PICKUP" || (acceptOrder + cookOrder >= 10 && order.status === "PLACED") ? true : false}
                                                onClick={handleChange}
                                            >
                                                Change State
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                fullWidth
                                                id={order._id}
                                                value={order.shop}
                                                variant="contained"
                                                color="primary"
                                                disabled={order.status === "PLACED" ? false : true}
                                                onClick={handleReject}

                                            >
                                                <Cancel></Cancel>REJECT</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </div >
    );
};

export default UsersList;
