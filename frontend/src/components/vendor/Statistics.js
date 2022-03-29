import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ls from "local-storage";
import Box from "@mui/material/Box";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { Button, ListSubheader, TextField, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";

import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
} from "@devexpress/dx-react-chart-material-ui";
import { RemoveFromQueue } from "@mui/icons-material";
import { Title } from "@devexpress/dx-react-chart";

var batch = [
  { argument: 'UG1', value: 0 },
  { argument: 'UG2', value: 0 },
  { argument: 'UG3', value: 0 },
  { argument: 'UG4', value: 0 },
  { argument: 'UG5', value: 0 },
  { argument: 'PG1', value: 0 },
  { argument: 'PG2', value: 0 },
];
var databatch = [
  { argument: 'UG1', value: 0 },
  { argument: 'UG2', value: 0 },
  { argument: 'UG3', value: 0 },
  { argument: 'UG4', value: 0 },
  { argument: 'UG5', value: 0 },
  { argument: 'PG1', value: 0 },
  { argument: 'PG2', value: 0 },
];
var dataage = [];

var arr1 = [];
var arr2 = [];
var arrbatch = [];
var arrage = [];

var freqbatch = [0, 0, 0, 0, 0, 0, 0];
var freqage = [];
function Creategraph() {
  return (
    <Chart style={{ height: "100px", width: "500px" }} data={databatch}>
      <ArgumentAxis />
      <ValueAxis />
      <BarSeries valueField="value" argumentField="argument" />
    </Chart>
  );
}
//argument and value fields
//for creating the graph

export default function VStatistics() {
  const [completedemails, setCompletedEmails] = useState([]);
  const [allbuyers, setAllBuyers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [placedorders, setPlacedOrders] = useState([]);
  const [pendingorders, setPendingOrders] = useState([]);
  const [completeorders, setCompleteOrders] = useState([]);
  const [array_5, setArray_5] = useState(["", "", "", "", ""]);
  useEffect(() => {
    axios
      .post("/api/vendor/allemails", {
        email: ls.get("email"),
      })
      .then((response) => {
        arr1 = response.data.emails;
        // console.log(arr1);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .post("/api/vendor/allbuyers")
      .then((response) => {
        arr2 = response.data.emails;
        arrbatch = response.data.batch;
        arrage = response.data.age;
        // console.log(arr2);
      })
      .catch((error) => {
        console.log(error);
      });
    axios
      .post("/api/vendor/statsplaced", {
        email: ls.get("email"),
      })
      .then((res) => {
        setPlacedOrders(res.data.placed);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post("/api/vendor/statspending", {
        email: ls.get("email"),
      })
      .then((res) => {
        setPendingOrders(res.data.pending);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post("/api/vendor/statscompleted", {
        email: ls.get("email"),
      })
      .then((res) => {
        setCompleteOrders(res.data.completed);
      })
      .catch((err) => {
        console.log(err);
      });
    axios
      .post("/api/vendor/statstop", {
        email: ls.get("email"),
      })
      .then((res) => {
        setArray_5(res.data.item);
      })
      .catch((err) => {
        console.log(err);
      });
    // console.log(arr2.length);
    //compare emails with allbuyers
    // for (let i = 0; i < arr1.length; i++) {
    //   for (let j = 0; j < arr2.length; j++) {
    //     if (arr1[i] === arr2[j]) {
    //       databatch[arrbatch[j]].value++;
    //       console.log(databatch);
    //     }
    //   }
    // }
  }, [refresh]);

  const handleclick = () => {
    databatch = [];
    dataage = [];
    databatch = batch;

    // console.log(arr1.length, arr2.length);
    for (let i = 0; i < arr1.length; i++) {
      for (let j = 0; j < arr2.length; j++) {
        // console.log(arr1[i], arr2[j], arrbatch[j], arrage[j]);
        if (arr1[i] == arr2[j]) {
          databatch[arrbatch[j]].value = databatch[arrbatch[j]].value + 1;
          // console.log(databatch);
          if(freqage[arrage[j]]==undefined){
            freqage[arrage[j]]=1;
          }
          else{
            freqage[arrage[j]]=freqage[arrage[j]]+1;
          }
          dataage.push({
            argument: arrage[j],
            value: freqage[arrage[j]],
          });
        }

      }
    }
    setRefresh(!refresh);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <List>
          <ListSubheader>
            <center>
              <h3>Most ordered food items</h3>
            </center>
          </ListSubheader>
          <Divider />
          <ListItem>
            <ListItemText primary="Item 1" secondary={array_5[0]} />
            <ListItemText primary="Item 2" secondary={array_5[1]} />
            <ListItemText primary="Item 3" secondary={array_5[2]} />
            <ListItemText primary="Item 4" secondary={array_5[3]} />
            <ListItemText primary="Item 5" secondary={array_5[4]} />
          </ListItem>
          <Divider />
        </List>
      </Box>
      <Box p={2}>
        <Stack>
          <List>
            <ListItem>
              <ListItemText primary="Orders Placed:" secondary={placedorders} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Orders Pending:"
                secondary={pendingorders}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Orders Completed:"
                secondary={completeorders}
              />
            </ListItem>
            <Divider />
          </List>
        </Stack>
      </Box >
      <Box p={2}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}>
      {/* <Creategraph /> */}
      <Button variant="contained" color="primary" onClick={handleclick}>
        Generate Graph
      </Button>
      </Box>
      <Box p={2}
      //arrange horizontally
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
      >
        <Stack>
          <Typography variant="h6">
            <center>
              <h5>Batch wise Distribution</h5>
            </center>
          </Typography>
      <Chart style={{ height: "100px", width: "500px" }} data={databatch}>
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries valueField="value" argumentField="argument" />
        {/* <Title text="Batch wise distribution" /> */}
      </Chart>
      </Stack>
      </Box>
      <Box p={2}
      //arrange horizontally
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
      >
        <Stack>
      <Typography variant="h6">
        <center>
          <h5>Age wise Distribution</h5>
        </center>
      </Typography>
      <Chart style={{ height: "100px", width: "1000px" }} data={dataage}>
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries valueField="value" argumentField="argument" />
        {/* <Title text="Age wise distribution" /> */}
      </Chart>
      </Stack>
      </Box>
    </div>
  );
}
