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
import Tab from '@mui/icons-material/KeyboardTab';
import Cancel from '@mui/icons-material/Cancel';

const UsersList = (props) => {

    const [orders, setOrders] = useState([]);
    const [state, setState] = useState("PLACED");
    const [acceptOrder, setAccept] = useState(0);
    const [cookOrder, setCook] = useState(0);

    const handleChange = (event) => {
        event.preventDefault();
        if (event.target.value === "REJECTED") {
            return event.target.disabled = true;
        }
        const query = {
            placed: 0,
            pending: 0,
            completed: 0,
            status: "",
            email: localStorage.getItem("email")
        };
        if (event.target.value === "PLACED") {
            // increase the placed order count
            query.placed = 1;
            if (acceptOrder + cookOrder < 10) {
                // accept order , increase the pending order count
                event.target.value = "ACCEPTED";
                query.pending = 1;
            }
        } else if (event.target.value === "ACCEPTED") {
            event.target.value = "COOKING";
        } else if (event.target.value === "COOKING") {
            event.target.value = "READY FOR PICKUP";
            // remove the pending order thing from pending_order
            query.pending = -1;
            // add the completed order count
            query.completed = 1;
        }

        console.log(event.target.id);
        console.log(event.target.value);

        axios
            .put("api/order/changestate", { _id: event.target.id, state: event.target.value })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });

        axios
            .post("api/order/getstatecount", { vendor_email: localStorage.getItem("email"), status: "ACCEPTED" })
            .then((res) => {
                console.log("Accept Count : " + res.data);
                setAccept(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        axios
            .post("api/order/getstatecount", { vendor_email: localStorage.getItem("email"), status: "COOKING" })
            .then((res) => {
                console.log("Cooking Count   " + res.data);
                setCook(res.data);
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
    });

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
                                        bgcolor={(order.status === "REJECTED" ? "lightgrey" : "").toString()}
                                        key={ind} >
                                        <TableCell>{ind}</TableCell>
                                        <TableCell>{order.item_name}</TableCell>
                                        <TableCell>{order.buyer_email}</TableCell>
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
                                                disabled={order.status === "COMPLETED" ? true : false}
                                                //disabled={order.status === "REJECTED" || order.status === "READY FOR PICKUP" || order.status === "COMPLETED" || (acceptOrder + cookOrder >= 10 && order.status === "PLACED") ? true : false}
                                                onClick={handleChange}
                                            >
                                                {order.status === "READY FOR PICKUP" ? "WAITING FOR BUYER" : <Tab />}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                fullWidth
                                                id={order._id}
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
