import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

React.useEffect(() => {
  axios
    .get("api/food/getaddon")
    .then((response) => {
      let temp = foodtags;
      console.log(response.data);
      for (var x in response.data) {
        console.log(response.data[x].curr_tag);
        if (
          temp.find((item) => item === response.data[x].curr_tag) === undefined
        ) {
          temp.push(response.data[x].curr_tag);
        }
      }

      console.log(temp);
      setfoodtags(temp);
      console.log(foodtags);
    })
    .catch((error) => {
      console.log(error);
    });
}, []);

const foodtags = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles2(curr_tag, tags, theme) {
  return {
    fontWeight:
      tags.indexOf(curr_tag) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip() {
  const theme = useTheme();
  const [tags, setTags] = React.useState([]);

  const handleTagChange = (event) => {
    const {
      target: { value },
    } = event;
    setTags(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={tags}
          onChange={handleTagChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {foodtags.map((curr_tag) => (
            <MenuItem
              key={curr_tag}
              value={curr_tag}
              style={getStyles2(curr_tag, tags, theme)}
            >
              {curr_tag}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
