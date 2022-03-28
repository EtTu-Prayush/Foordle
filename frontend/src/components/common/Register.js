import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Vendor_Register from "./register_vendor";
import Buyer_Register from "./register_buyer";

export default function BasicSelect() {
  const [user_type, set_user_type] = React.useState("");

  const handleChange = (event) => {
    set_user_type(event.target.value);
  };

  return (
    <Grid>
      <Box>
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">User Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={user_type}
              label="User Type"
              onChange={handleChange}
            >
              <MenuItem value={"vendor"}>Vendor</MenuItem>
              <MenuItem value={"buyer"}>Buyer</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {user_type === "vendor" ? (
          <Vendor_Register />
        ) : user_type === "buyer" ? (
          <Buyer_Register />
        ) : null}{" "}
      </Box>
    </Grid>
  );
}
