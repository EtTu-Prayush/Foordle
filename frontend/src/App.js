import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";
import Register from "./components/common/Register";
import Navbar from "./components/templates/Navbar";
import Login from "./components/common/login";
import Profile from "./components/common/profile";
import Wallet from "./components/common/wallet";
import FoodMenu from "./components/common/food_menu";
import AddItem from "./components/common/additem";
import Order from "./components/common/order3"
import Orderuser from "./components/common/buyer_order_now";
import MyOrder from "./components/common/buyer_show_order";
import Favorite from "./components/common/favorites";
import Stats from "./components/common/stats";
const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="users" element={<UsersList />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="foodList" element={<FoodMenu />} />
          <Route path="addItem" element={<AddItem />} />
          <Route path="orders" element={<Order />} />
          <Route path="userOrder" element={<Orderuser />} />
          <Route path="myOrder" element={<MyOrder />} />
          <Route path="favorite" element={<Favorite />} />
          <Route path="stats" element={<Stats />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
