import { color } from "@mui/system";
import { useState, useEffect } from "react";
import picture from "../../images/home_img.jpg";

const Home = (props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // useEffect(() => {
  //   setName("Dass TAs");
  // }, []);

  return <div style={{ textAlign: "center" }}> <p>!Cheese Maggi to Oreo Shake at one place!</p> <img src={picture} alt="Picture" /> </div> ;
};

export default Home;
