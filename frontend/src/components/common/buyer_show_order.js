import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import RateBox from "./rateBox"
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import * as React from 'react';

function BasicRating(props) {
    const [value, setValue] = useState(props.value);
    return (
        <Box
            sx={{
                '& > legend': { mt: 2 },
            }}
        >
            <Rating name="read-only" value={props.value} readOnly />

        </Box>
    );
}



const UsersList = (props) => {
    const [users, setUsers] = useState([]);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [sortName, setSortName] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [edit_menu, setEditMenu] = useState("0");
    const [rate, setRate] = useState(0);
    const [isRates, isR] = useState(0);
    localStorage.setItem("edit_menu", "0");

    useEffect(() => {
        axios
            .post("api/order/myorder", { buyer_email: localStorage.getItem("email") })
            .then((response) => {
                setUsers(response.data);
                setSortedUsers(response.data);
                setSearchText("");
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);
    const sortChange = () => {
        let usersTemp = users;
        const flag = sortName;
        usersTemp.sort((a, b) => {
            if (a.date != undefined && b.date != undefined) {
                return (1 - flag * 2) * (new Date(a.date) - new Date(b.date));
            } else {
                return 1;
            }
        });
        setUsers(usersTemp);
        setSortName(!sortName);
    };

    const customFunction = (event) => {
        console.log(event.target.value);
        setSearchText(event.target.value);
    };

    return (
        <div>
            <Grid container>
                <Grid item xs={12} md={9} lg={9}>
                    <Paper>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell> Sr No.</TableCell>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>
                                        Price
                                    </TableCell>
                                    <TableCell>
                                        Vendor Shop
                                    </TableCell>
                                    <TableCell>
                                        Add-Ons
                                    </TableCell>
                                    <TableCell>
                                        Time-Placed
                                    </TableCell>
                                    <TableCell>
                                        Quantity
                                    </TableCell>
                                    <TableCell>
                                        Status
                                    </TableCell>

                                    <TableCell>
                                        Rating
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user, ind) => (
                                    <TableRow
                                        bgcolor={(user.status === "REJECTED" ? "lightgrey" : (user.status === "COMPLETED" ? "lightgreen" : "")).toString()}
                                        key={ind}>
                                        <TableCell>{ind}</TableCell>
                                        <TableCell>{user.item_name}</TableCell>
                                        <TableCell>{user.bill}</TableCell>
                                        <TableCell>{user.vendor_shop}</TableCell>
                                        <TableCell>
                                            {
                                                user.addon_name.map((addon, ind) => (
                                                    <div key={ind}>
                                                        {addon}{"  "}
                                                    </div>
                                                ))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {user.placed_time}
                                        </TableCell>
                                        <TableCell>{user.quantity}</TableCell>
                                        <TableCell>

                                            <Button
                                                variant="contained"
                                                color="primary"
                                                disabled={(user.status === "READY FOR PICKUP" && !Boolean(user.rated)) ? false : true}
                                                onClick={() => {
                                                    if (user.status === "READY FOR PICKUP") {

                                                        axios
                                                            .put("api/order/changestate", { _id: user._id, state: "COMPLETED" })
                                                            .then((res) => {
                                                                console.log(res);
                                                                axios
                                                                    .put("api/vendor/updateComplete", { vendor_email: user.vendor_email })
                                                                    .then((res) => {
                                                                        axios
                                                                            .put("api/food/incSold", { name: user.item_name, email: user.vendor_email })
                                                                            .then((res) => { })
                                                                            .catch((err) => {
                                                                                console.log(err);
                                                                            });
                                                                        console.log(res);
                                                                    })
                                                                    .catch((error) => {
                                                                        console.log(error);
                                                                    });

                                                                alert("Order Completed");
                                                            })
                                                            .catch((err) => {
                                                                console.log(err);
                                                            });


                                                    }
                                                }}
                                            >
                                                {user.status}
                                            </Button>

                                        </TableCell>
                                        <TableCell>
                                            {
                                                user.rated !== 0 ? <div>{user.rated}</div> :
                                                    <RateBox isRate={isRates} set={isR} rating={user.rated} rate={rate} setRate={setRate} email={user.vendor_email} name={user.item_name} id={user._id} numRated={user.num_rated} rating={user.rating} disabled={user.status === "COMPLETED" ? false : true} id={user._id} />
                                            }
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
