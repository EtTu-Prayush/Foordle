import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import axios from "axios"
import Grid from "@mui/material/Grid";
import { ListItemText } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Star from '@mui/icons-material/StarPurple500Sharp';



export default function RatingFormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [rating, setRating] = React.useState(5);
    const handleClickOpen = () => {
        setOpen(true);
    };
    console.log("rating", rating)
    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = () => {
        let y = rating;
        props.set(y);
        console.log(y);
        axios
            .put("api/food/rate", { email: props.email, name: props.name, newRating: y })
            .then(res => {
                props.setRate(Number(res.data.rating))
                console.log(res);
                handleClose();

                axios
                    .put("api/order/rate", { _id: props.id, rate: y })
                    .then(res => {
                        console.log(res);
                        alert("Rating submitted!")
                    })
                    .catch(err => {
                        console.log(err);
                    })
            })

            .catch(err => {
                console.log(err);
            });
        window.location.reload();
    };
    return (
        (<div>
            <Button
                variant="contained"

                color="primary"
                disabled={props.disabled}  onClick={handleClickOpen}>
                Rate Your Order
            </Button>
            <Dialog fullWidth
                open={open} onClose={handleClose}>
                <DialogTitle>Rate</DialogTitle>
                <DialogContent>
                    <DialogContentText >
                        Rate Your Order !
                    </DialogContentText>
                    <Grid item xs={12}>
                        <ListItemText primary="Rating" />
                        <FormControl required fullWidth>
                            <Select
                                labelId="demo-simple-select-label"
                                name="rating_bar"
                                value={rating}
                                onChange={(e) => { setRating(e.target.value) }}

                            >
                                <MenuItem value={1}><Star /></MenuItem>
                                <MenuItem value={2}> <Star /><Star /></MenuItem>
                                <MenuItem value={3}><Star /><Star /><Star /></MenuItem>
                                <MenuItem value={4}><Star /><Star /><Star /><Star /></MenuItem>
                                <MenuItem value={5}><Star /><Star /><Star /><Star /><Star /></MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogActions>
            </Dialog>
        </div >)
    );
}
