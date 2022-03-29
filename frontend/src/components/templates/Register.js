import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SignUpB from './Registerbuyer';
import SignUpV from './Registervendor';
import Grid from "@mui/material/Grid";


export default function BasicSelect() {
  const [buyer, setBuyer] = React.useState(0);
  const [vendor, setVendor] = React.useState(0);
  

  const handleChange = (event) => {
    //setUser(event.target.value);
    if(event.target.value === ''){
      setVendor(0);
      setBuyer(0);
    }
    else if(event.target.value === 'buyer'){
      setBuyer(1);
      setVendor(0);
    }
    else if(event.target.value === 'vendor'){
      setBuyer(0);
      setVendor(1);
    }
  };

  return (
    <Box>
    <Box sx={{ minWidth: 120 }}>
      <Grid fullwidth>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Buyer/Vendor</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          // value={buyer ? 'buyer' : vendor ? 'vendor' : 'Select'}
          value={buyer===1 ? 'buyer' : vendor===1 ? 'vendor' : ''}
          label="Buyer/Vendor"
          onChange={handleChange}
        >
          <MenuItem value="buyer">Buyer</MenuItem>
          <MenuItem value="vendor">Vendor</MenuItem>
        </Select>
        {/* <NewFunc /> */}
      </FormControl>
      </Grid>
    </Box>
    <Box>
      {buyer===1 ? <SignUpB /> : <></>}
      {vendor===1 ? <SignUpV /> : <></>}
    </Box>
    </Box>
  );
}
