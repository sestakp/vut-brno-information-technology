/**
 * Author: Pavel Šesták
 */
import InputAdornment from '@mui/material/InputAdornment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { TextField, FormControlLabel, Checkbox } from "@material-ui/core";
import "./BoolSearch.css";

export default function TextSearch(props){
    return (
        <div className="select-box-search">
        <FormControlLabel
        className="formControlLabel"
        control={
            <Checkbox
            checked={props.defaultValue}   
            name={props.column.id}
            color="default"
            
            onChange={(e) => props.onChange(e.target.checked, props.column.id)}
            />
        } 
        label={props.column.header}
        />
        </div>
    )
}