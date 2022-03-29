import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import noodle from "../../images/peach-cat-cute.gif";
import { useState } from "react";
import * as React from "react";
import ls from "local-storage";
import { createTheme } from '@mui/material/styles';
import { deepOrange } from "@mui/material/colors";
import { yellow } from "@mui/material/colors";

const theme = createTheme({
    palette: {
      primary: deepOrange,
      secondary: yellow,
    },
});

const Navbar = () => {
  const navigate = useNavigate();
//  const [user, setUser] = React.useState(0); //0 for not logged in, 1 for buyer, 2 for vendor
  const handlelogout = () => {
    ls.set("user", "");
    ls.set("usertype", 0);
    ls.set("username", "");
    ls.set("wallet", 0);
    window.location="/";
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            <img src={noodle} alt="noodle" height="20" width="30" margin=""/> Canteen Portal <img src={noodle} alt="noodle" height="20" width="30" margin=""/>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* <Button color="inherit" onClick={() => navigate("/users")}>
            Users
          </Button> */}
          { ls.get("usertype") === 0 ? 
          <Box>
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button> 
          <Button color="inherit" onClick={() => navigate("/register")}>
            Register
          </Button>
          </Box>
          : ls.get("usertype") === 1 ?
          <Box>
          <Button color="inherit" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={() => navigate("/favourites")}>
            Favourites
          </Button>
          <Button color="inherit" onClick={() => navigate("/myorders")}>
            My Orders
          </Button>
          <Button color="inherit" onClick={() => navigate("/wallet")}>
            Wallet
          </Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Profile
          </Button>
          <Button color="inherit" onClick={handlelogout}>
            Logout
          </Button>
          </Box>
          :
          <Box>
          <Button color="inherit" onClick={() => navigate("/menu")}>
            Menu
          </Button>
          <Button color="inherit" onClick={() => navigate("/orders")}>
            Orders
          </Button>
          <Button color="inherit" onClick={() => navigate("/statistics")}>
            Statistics
          </Button>
          <Button color="inherit" onClick={() => navigate("/profile")}>
            Profile
          </Button>
          <Button color="inherit" onClick={handlelogout}>
            Logout
          </Button>
          </Box>
          }
          {/* <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button color="inherit" onClick={() => navigate("/register")}>
            Register
          </Button>
          }
          else if(user === 1) {
          <Button color="inherit" onClick={() => navigate("/profile")}>
            My Profile
          </Button>
          } */}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
