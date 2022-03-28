import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';

export default function ControlledCheckbox() {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event) => {

        setChecked(event.target.checked);
    };

    return (
        <Checkbox
            checked={checked}
            onChange={handleChange}
            icon={<Favorite />}
            checkedIcon={<Favorite />}
            checkColor='red'
            inputProps={{ 'aria-label': 'controlled' }}
        />
    );
}
