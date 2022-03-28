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
import InputAdornment from '@mui/material/InputAdornment';

const theme = createTheme();

function AddOns(props) {
    const handleAddOnSubmit = (event) => {
        event.preventDefault();
        const name = document.getElementById(`addOnName${props.index}`).value
        const price = document.getElementById(`addOnPrice${props.index}`).value

        if (name === '' || price === '') {
            alert("Empty Fields Not Allowed");
        } else {
            if (props.addOnNames.length < props.index) {
                alert("Error ");
            } else {
                if (props.addOnNames.length === props.index) {
                    props.setAddOnNames([...props.addOnNames, name]);
                    props.setAddOnPrices([...props.addOnPrices, price]);
                } else {
                    let newNames = [...props.addOnNames];
                    let newPrices = [...props.addOnPrices];
                    newNames[props.index] = name;
                    newPrices[props.index] = price;
                    props.setAddOnNames(newNames);
                    props.setAddOnPrices(newPrices);
                }
            }
        }
    };
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
                <TextField
                    id={`addOnName${props.index}`}
                    fullWidth
                    size="small"
                    value={props.addOnNames[props.index]}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <TextField
                    id={`addOnPrice${props.index}`}
                    label="Add On Price"
                    fullWidth
                    size="small"
                    type="number"
                    value={props.addOnPrices[props.index]}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    }}
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

function AddTags(props) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const Tags = {
            name: document.getElementById(`foodTags${props.index}`).value,
        }

        if (Tags.name === '') {
            alert("Please enter a valid name and price");
        } else {
            if (props.foodTags.length < props.index) {
                alert("Make sure previous Tags are added before adding new ones");
            } else if (props.foodTags.length === props.index) {
                props.setTag([...props.foodTags, Tags.name]);
                // props.setKey(props.key + 1);
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
                    value={props.foodTags[props.index]}
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

export default function FoodItems(props) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [foodItem, setFoodItem] = useState([]);
    const [foodItemPrice, setFoodItemPrice] = useState([]);
    const [count, setCount] = useState(0);
    const [foodTags, setTag] = useState([]);
    const [countTags, setCountTags] = useState(0);
    const [food_type, setFoodType] = useState("");
    const vendor_email = localStorage.getItem('email');
    const user_email = localStorage.getItem('email');
    const on_change_food_type = (event) => {
        setFoodType(event.target.value);
    };
    // make axios request to the backend to request for the food data firstly
    React.useEffect(() => {
        if (user_email) {
            axios.post("api/vendor/getitem", { name: localStorage.getItem("item_name_editing"), vendor_email: vendor_email })

                .then((response) => {
                    console.log(response.data[0]);
                    localStorage.setItem("editID", response.data[0]._id);
                    setName(response.data[0].name);
                    setPrice(response.data[0].price);
                    setFoodItem(response.data[0].addon_name);
                    setFoodType(response.data[0].food_type);
                    setCount(response.data[0].addon_name.length)
                    setCountTags(response.data[0].tags.length)
                    setFoodItemPrice(response.data[0].addon_price);
                    setTag(response.data[0].tags);
                })
                .catch((err) => {
                    console.log(err);
                }
                );
        }
    }, []);


    const handleChange = (event) => {
        event.preventDefault();
        const newFoodItem = {
            id: localStorage.getItem("editID"),
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
            .put("api/vendor/food_items", newFoodItem)
            .then((response) => {
                console.log(response);
                localStorage.setItem("edit", "0");
                alert("Food Item Updated Successfully");
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    var addOnFields = [];
    for (var x = 0; x < count; x++) {
        addOnFields.push(<AddOns key={x} index={x} addOnNames={foodItem} addOnPrices={foodItemPrice} setAddOnNames={setFoodItem} setAddOnPrices={setFoodItemPrice} />);
    }

    var tagFields = [];
    for (var i = 0; i < countTags; i++) {
        tagFields.push(<AddTags key={i} index={i} foodTags={foodTags} setTag={setTag} />);
    }
    const handleReset = () => {
        setCount(0);
        addOnFields = [];
        setFoodItemPrice([]);
        setFoodItem([]);
    }
    const handleResetTag = () => {
        setCountTags(0);
        tagFields = [];
        setTag([]);
    }
    console.log(foodTags)
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
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
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
                                    value={price}
                                    onChange={(event) => setPrice(event.target.value)}
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
                                    onClick={() => {
                                        handleReset();
                                    }}

                                >RESET ADDONS </Button>
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
                                <Button

                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => {
                                        handleResetTag();
                                    }}

                                >RESET TAGS </Button>
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
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>

                    </Box>
                </Box>
            </Container>
        </ThemeProvider >
    )
}