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

const UsersList = (props) => {
    const [users, setUsers] = useState([]);
    const [sortedUsers, setSortedUsers] = useState([]);
    const [sortName, setSortName] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [edit_menu, setEditMenu] = useState("0");
    localStorage.setItem("edit_menu", "0");
    useEffect(() => {
        axios
            .post("api/vendor/item_list", { email: localStorage.getItem("email") })
            .then((response) => {
                setUsers(response.data);
                setSortedUsers(response.data);
                setSearchText("");
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
                    <Grid item xs={12} md={9} lg={9}>
                        <Paper>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell> Sr No.</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>
                                            Price
                                        </TableCell>
                                        <TableCell>
                                            Rating
                                        </TableCell>
                                        <TableCell>
                                            Food Type
                                        </TableCell>
                                        <TableCell>
                                            Tags
                                        </TableCell>
                                        <TableCell>
                                            Add-Ons
                                        </TableCell>
                                        <TableCell>Delete</TableCell>
                                        <TableCell>Edit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user, ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{ind}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.price}</TableCell>
                                            <TableCell>{user.rating}</TableCell>
                                            <TableCell>{
                                                user.food_type == "veg" ? <img src={veg} alt="veg" height="20px" width="20px" /> : <img src={nonveg} alt="nonveg" height="20px" width="20px" />
                                            }</TableCell>
                                            <TableCell>{user.tags.map((name, ind) => (
                                                <div key={ind}>
                                                    {name}
                                                </div>
                                            ))
                                            }
                                            </TableCell>
                                            <TableCell>{user.addon_name.map((name, ind) => (
                                                <div key={ind}>
                                                    {name}
                                                </div>
                                            ))}</TableCell>
                                            <TableCell>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="secondary"
                                                    value={user.name}
                                                    onClick={() => { handleDelete({ name: user.name }) }}
                                                ><DeleteIcon>Delete</DeleteIcon></Button>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    color="primary"
                                                    value={user.name}
                                                    onClick={() => { handleEdit({ name: user.name }) }}
                                                >
                                                    <EditIcon>Edit</EditIcon></Button>

                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div >
        ) : (<EditMenu />));
};

export default UsersList;
