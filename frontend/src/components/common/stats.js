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
import EditMenu from "./edit_menu";
import veg from "../images/veg.png";
import nonveg from "../images/non-veg.png";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import List from "@mui/material/List";
import TextField from '@mui/material/TextField';

import { Typography } from "@mui/material";
const UsersList = (props) => {
    const [users, setUsers] = useState([]);
    const [sortName, setSortName] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [edit_menu, setEditMenu] = useState("0");
    localStorage.setItem("edit_menu", "0");
    const [order, setOrder] = useState([]);
    const [placed, setPlaced] = useState(0);
    const [completed, setComplete] = useState(0);
    const [pending, setPending] = useState(0);

    useEffect(() => {
        axios
            .post("api/vendor/getSTATS", { email: localStorage.getItem("email") })
            .then((response) => {
                setPlaced(response.data.total);
                setComplete(response.data.completed);
                setPending(response.data.total - response.data.completed - response.data.cancelled);

                axios.post("api/order/orderstat", { vendor_email: localStorage.getItem("email") })
                    .then((response) => {
                        setOrder(response.data);
                    }
                    )
                    .catch((err) => {
                        console.log(err);
                    }
                    );
            })
            .catch((error) => {
                console.log(error);
            });


    }, []);

    function handleDelete(props) {
        console.log(props.name);
        axios
            .post("api/vendor/remove_item", { name: props.name, vendor_email: localStorage.getItem("email") })
            .then((response) => {
                window.location.reload();
            }
            )
            .catch((error) => {
                console.log(error);
            }
            );
    };


    function handleEdit(props) {

        localStorage.setItem("item_name_editing", props.name);
        if (edit_menu === "0") {
            setEditMenu("1");
        } else {
            setEditMenu("0");
        }


    }

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
        edit_menu === "0" ? (
            <div>
                <Grid container>
                    <Grid>
                        <Paper>
                            <Typography
                                id="discrete-slider"
                                gutterBottom
                                variant="h4"
                            > Statistics Page</Typography>
                            <br></br>
                            <br></br>

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Completed Orders
                                        </TableCell>
                                        <TableCell>
                                            Placed Orders
                                        </TableCell>
                                        <TableCell>
                                            Pending Orders
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {completed}
                                        </TableCell>
                                        <TableCell>
                                            {placed}
                                        </TableCell>
                                        <TableCell>
                                            {pending}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>

                            </Table>
                        </Paper>
                        <br></br>
                        <br></br>

                        <Grid>
                            <Typography
                                id="discrete-slider"
                                gutterBottom
                                variant="h4"
                            > Top Five Food Items </Typography>
                            <br></br>
                            <br></br>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            Name
                                        </TableCell>
                                        <TableCell>
                                            Sold Count
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {order.map((Orders) => (
                                        <TableRow key={Orders.name}>
                                            <TableCell>
                                                {Orders.name}
                                            </TableCell>
                                            <TableCell>
                                                {Orders.num_sold}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>

                    </Grid>
                </Grid>
            </div >
        ) : (<EditMenu />));
};

export default UsersList;
