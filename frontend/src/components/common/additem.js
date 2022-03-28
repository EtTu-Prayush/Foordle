import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ListItemText } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Avatar from '@mui/icons-material/LocalDining';
let xD = 0
const theme = createTheme();

function AddOnsList(props) {
    const handleAddOnSubmit = (event) => {
        event.preventDefault();
        //const addOn = {
        const name = document.getElementById(`names${props.index}`).value
        const price = document.getElementById(`prices${props.index}`).value
        // };
        if (name === '' || price === '') {
            alert("Empty Strings Not allowed");
        } else {
            if (props.names.length > props.index) {
                let newNames = [...props.names];
                let newPrices = [...props.prices];
                newNames[props.index] = name;
                newPrices[props.index] = price;
                props.setAddOnNames(newNames);
                props.setAddOnPrices(newPrices);
            } else {
                if (props.names.length === props.index) {
                    props.setAddOnNames([...props.names, name]);
                    props.setAddOnPrices([...props.prices, price]);
                } else {
                    alert("Error");

                }
            }
            xD++;
            console.log(xD)
            console.log(props.names)
        }
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <TextField
                    id={`names${props.index}`}
                    label="addon names"
                    fullWidth
                    size="small"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    id={`prices${props.index}`}
                    label="addon price"
                    fullWidth
                    size="small"
                    type="number"
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <Button
                    onClick={handleAddOnSubmit}
                    fullWidth
                    variant="contained"
                >
                    Submit Add On
                </Button>
            </Grid>
        </Grid>
    );
}

function TagList(props) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const Tags = {
            name: document.getElementById(`foodTags${props.index}`).value,
        }

        if (Tags.name === '') {
            alert("Empty Value not allowed");
        } else {
            if (props.foodTags.length < props.index) {
                alert("Add Tags !!");
            } else if (props.foodTags.length === props.index) {
                props.setTag([...props.foodTags, Tags.name]);
            } else {
                let newTags = [...props.foodTags];
                newTags[props.index] = Tags.name;
                props.setTag(newTags);
            }
        }
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
                <TextField
                    id={`foodTags${props.index}`}
                    label="tags"
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <Button
                    onClick={handleSubmit}
                    fullWidth
                    variant="contained"
                    color="inherit"
                >
                    Submit Tag
                </Button>
            </Grid>
        </Grid>
    );

}

export default function FoodItems() {

    const [foodItem, setFoodItem] = useState([]);
    const [foodItemPrice, setFoodItemPrice] = useState([]);
    const [count, setCount] = useState(0);
    const [foodTags, setTag] = useState([]);
    const [countTags, setCountTags] = useState(0);
    const [food_type, setFoodType] = useState("");
    const vendor_email = localStorage.getItem('email');
    const on_change_food_type = (event) => {
        setFoodType(event.target.value);
    };

    // make axios request to the backend to request for the food data firstly
    React.useEffect(() => {
        axios.post("api/vendor/item_list", { email: vendor_email })

            .then((response) => {
                setFoodItem(response.data);
            })
            .catch((err) => {
                console.log(err);
            }
            );
    }, []);

    const handleChange = (event) => {
        event.preventDefault();
        const newFoodItem = {
            name: document.getElementById("name").value,
            price: document.getElementById("price").value,
            vendor: (localStorage.getItem("shop_name")) ? localStorage.getItem("shop_name") : "misc",
            vendor_email: localStorage.getItem("email"),
            addon_name: foodItem,
            food_type: food_type,
            addon_price: foodItemPrice,
            tags: foodTags
        };
        console.log(newFoodItem)
        console.log(foodItem)
        console.log(foodItemPrice)
        axios
            .post("api/vendor/food_items", newFoodItem)
            .then((response) => {
                console.log(response);
                alert("Food Item Added Successfully");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                alert("Error Occured");
            });
    };

    var addOnFields = [];
    for (var x = 0; x < count; x++) {
        addOnFields.push(<AddOnsList key={x} index={x} names={foodItem} prices={foodItemPrice} setAddOnNames={setFoodItem} setAddOnPrices={setFoodItemPrice} />);
    }

    var tagFields = [];
    for (var i = 0; i < countTags; i++) {
        tagFields.push(<TagList key={i} index={i} foodTags={foodTags} setTag={setTag} />);
    }
    console.log(foodTags);
    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        ADD ITEM
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        onSubmit={handleChange}
                        sx={{ mt: 3 }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="price"
                                    label="Price"
                                    name="price"
                                    autoComplete="price"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => { setCount(count + 1) }}
                                > ADD FOOD ADD-ON</Button>
                            </Grid>
                            <Grid item xs={12}>
                                {addOnFields}
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => { setCountTags(countTags + 1) }}
                                > ADD TAGS</Button>
                            </Grid>
                            <Grid item xs={12}>
                                {tagFields}
                            </Grid>
                            <Grid item xs={12}>
                                <ListItemText primary="Food Type" />
                                <FormControl required fullWidth>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="food_type"
                                        name="food_type"
                                        value={food_type}
                                        onChange={on_change_food_type}
                                    >
                                        <MenuItem value={"veg"}>veg</MenuItem>
                                        <MenuItem value={"non-veg"}>non-veg</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                // onClick={handleChange}
                                >
                                    ADD ITEM
                                </Button>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider >
    )
}