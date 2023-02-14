/**
 * Author: Pavel Šesták
 */
import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


export default function TextSearch(props){
    return (
        <TextField
            style={{width: "100%"}}
            placeholder={props.column.header} 
            className="pb-1 pt-1"   
            defaultValue={props.defaultValue}             
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <FilterAltIcon />
                    </InputAdornment>
                ),
              }}
            onChange={(e) => props.onChange(e.target.value, props.column.id)}
        />
    )
}