import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";
import Navbar from "./components/templates/Navbar";
import Profile from "./components/users/Profile";
import SignInSide from "./components/templates/Login";
import SignUp from "./components/templates/Register";
import BasicSelect from "./components/templates/Register";
import MyProfile from "./components/templates/Profile";


//buyer
import Wallet from "./components/buyer/Wallet";
import List from "./components/buyer/BuyerDashboard"
import MyOrders from "./components/buyer/Orders";
import Fav from "./components/buyer/Favourites";

//vendor
import Orders from "./components/vendor/Orders";
import VStatistics from "./components/vendor/Statistics";
import Table from "./components/vendor/Menu";
import BasicTable from "./components/vendor/Orders";
import Editing from "./components/vendor/EditItem";

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
          <Route path="login" element={<SignInSide />} />
          <Route path="register" element={<BasicSelect />} />
          <Route path="profile" element={<MyProfile />} />

          <Route path="wallet" element={<Wallet />} />
          <Route path="myorders" element={<MyOrders />} />
          <Route path="dashboard" element={<List />} />
          <Route path="favourites" element={<Fav />} />

          <Route path="statistics" element={<VStatistics />} />
          <Route path="orders" element={<BasicTable />} />
          <Route path="menu" element={<Table />} />
          <Route path="edit" element={<Editing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
