/**
 * Author: Lukáš Plevač
 */
import React from "react";
import { connect } from "react-redux";
import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import TextSearch from "./Filters/TextSearch";
import BoolSearch from "./Filters/BoolSearch";
import * as baseRenderLibrary from "../../../utils/renderLibraries/baseRenderLibrary";

function Filter(props){

    function onChange(value, field){
        
        props.SetFilter(field, value);
    }

    return(
        <div>
            <TextField 
                key="global"
                style={{width: "100%"}}
                placeholder="Global filter" 
                className="pb-1 pt-1"
                defaultValue={props.filter["global"]}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <FilterAltIcon />
                        </InputAdornment>
                    ),
                  }}
                onChange={(e) => onChange(e.target.value, "global")}
            />
            
            {props.recordLibrary.columnsToFilter.map((column, index) => {
                switch(column.type){
                    case baseRenderLibrary.dataSettingTypes.INPUT:
                        return (
                            <TextSearch 
                                key={column.id}
                                column={column}
                                onChange={onChange}
                                defaultValue={props.filter[column.id]}
                            />
                        )
                    case baseRenderLibrary.dataSettingTypes.CHECKBOX:
                        return(
                            <BoolSearch
                                key={column.id}
                                column={column}
                                onChange={onChange}
                                defaultValue={props.filter[column.id]}
                            />
                        );
                    default:
                        break;
                }
               
            })
            }
        </div>
    )

}

const mapStateToProps = (state, ownProps) => ({

});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    SetFilter: (field, value) => dispatch(ownProps.actions.SetFilter(field, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filter);