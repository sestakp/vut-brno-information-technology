import React from "react";
import TextField from '@mui/material/TextField';

import InputAdornment from '@mui/material/InputAdornment';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import { AsyncThunk, ActionCreatorWithPayload, ActionCreatorWithoutPayload } from '@reduxjs/toolkit';
import entityLibrary from "../../../models/utils/renderUtils/entityLibrary";
import { useAppDispatch } from "../../../app/hooks";

export interface Props{
  setFilter: ActionCreatorWithPayload<{field: string, value: any}, any>
  recordLibrary:entityLibrary, 
  filter: {[key: string]: any},
}

function Filter(props: Props){
    const dispatch = useAppDispatch();

    function onChange(value:any , field:any){
        dispatch(props.setFilter({field, value}));
    }

    return(
        <div>
            <TextField 
                key="global_filter"
                placeholder="Global filter" 
                defaultValue={props.filter.global}
                className="pb-1 pt-1"
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
                return (
                    <TextField 
                        key={column.id}
                        placeholder={column.header}
                        defaultValue={props.filter[column.id]}
                        className="pb-1 pt-1"                
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FilterAltIcon />
                                </InputAdornment>
                            ),
                          }}
                        onChange={(e) => onChange(e.target.value, column.id)}
                    />
                )
            })

            }
        </div>
    )

}

export default Filter;
