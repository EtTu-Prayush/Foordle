import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as React from "react";
import axios from "axios";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Navbar = () => {
  const navigate = useNavigate();
  const refresh_storage = () => {
    localStorage.setItem("email", "");
    localStorage.setItem("password", "");
    localStorage.setItem("status", "");
    localStorage.setItem("user_type", "");
    alert("Logout Success!");
    window.location = "/";
  };

  const [wallet, setWallet] = React.useState(0);
  React.useEffect(() => {
    if (localStorage.getItem("user_type") === "buyer") {
      axios
        .post("api/buyer/wallet_balance", {
          email: localStorage.getItem("email"),
        })
        .then((res) => {
          console.log(res.data);
          setWallet(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (localStorage.getItem("status") === null) {
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      localStorage.setItem("status", "");
      localStorage.setItem("status", "");
    }
  });

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="relative">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Canteen Portal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {localStorage.getItem("status") === "1" &&
          localStorage.getItem("user_type") === "vendor" ? (
            <Button color="inherit" onClick={() => navigate("/profile")}>
              My Profile
            </Button>
          ) : null}
          {localStorage.getItem("status") === "1" &&
          localStorage.getItem("user_type") === "buyer" ? (
            <Button color="inherit" onClick={() => navigate("/profile")}>
              My Profile
            </Button>
          ) : null}
          {localStorage.getItem("status") === "1" &&
          localStorage.getItem("user_type") === "vendor" ? (
            <Button color="inherit" onClick={() => navigate("/orders")}>
              Orders
            </Button>
          ) : null}
          {localStorage.getItem("status") === "" ? (
            <Button color="inherit" onClick={() => navigate("/register")}>
              Register
            </Button>
          ) : null}
          {localStorage.getItem("status") === "" ? (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          ) : null}{" "}
          {localStorage.getItem("user_type") === "vendor" &&
          localStorage.getItem("status") === "1" ? (
            <Button color="inherit" onClick={() => navigate("/foodList")}>
              {" "}
              Food Menu
            </Button>
          ) : null}
          {localStorage.getItem("user_type") === "vendor" &&
          localStorage.getItem("status") === "1" ? (
            <Button color="inherit" onClick={() => navigate("/additem")}>
              {" "}
              Add Item
            </Button>
          ) : null}
          {localStorage.getItem("user_type") === "vendor" &&
          localStorage.getItem("status") === "1" ? (
            <Button color="inherit" onClick={() => navigate("/stats")}>
              {" "}
              Statistics
            </Button>
          ) : null}
          {localStorage.getItem("user_type") === "buyer" &&
          localStorage.getItem("status") === "1" ? (
            <Button color="inherit" onClick={() => navigate("/userOrder")}>
              ORDER NOW
            </Button>
          ) : null}
          {localStorage.getItem("user_type") === "buyer" &&
          localStorage.getItem("status") === "1" ? (
            <Button color="inherit" onClick={() => navigate("/myOrder")}>
              VIEW ORDERS
            </Button>
          ) : null}
          {localStorage.getItem("user_type") === "buyer" &&
          localStorage.getItem("status") === "1" ? (
            <Button color="inherit" onClick={() => navigate("/favorite")}>
              FAVORITES
            </Button>
          ) : null}
          {localStorage.getItem("status") === "1" &&
          localStorage.getItem("user_type") === "buyer" ? (
            <Button color="inherit" onClick={() => navigate("/wallet")}>
              <AccountBalanceWalletIcon> Wallet</AccountBalanceWalletIcon>
              <Box sx={{ ml: 1 }}>{wallet}</Box>
            </Button>
          ) : null}
          {localStorage.getItem("status") === "1" ? (
            <Button color="inherit" onClick={() => refresh_storage()}>
              Logout
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
