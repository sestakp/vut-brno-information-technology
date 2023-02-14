import React, { Component } from 'react';
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import DataSettingColumn from "../../models/utils/renderUtils/DataSettingColumn";
import Model from "../../models/api/Model";
import Option from "../../models/components/FormAutoComplete/Option";

interface Props{
  column: DataSettingColumn,
  //options: Model[],
  object: {[key: string]: any },
  handleRecordChange: (id: string, value: any) => void,
}

function FormAutoCompleteFree(props: Props) {


      let index = props.column.optionsId;
      let options:Option[] = [];
      if(index !== undefined){
        options= props.object[index] ?? props.column.optionDataProvider
      }
        

      if(props.column.defaultSelectText){
          options.unshift({label: props.column.defaultSelectText});
      }

      let value = props.object[props.column.id];
      return (
            <Autocomplete
              key={props.column.id+"_autocomplete"}
              options={options}  
              getOptionLabel={(option) => option.label ?? option.contractAbbreviation ?? option.nameNew ?? option.name ?? option}
              getOptionSelected={(option, value) => option?.id === value?.id}
              value={options.find(x => x.id === value) ?? value}
              defaultValue={options.find(x => x.id === value) ?? value}
              freeSolo
              size="small"
              onChange={(event, newValue) => {
                props.handleRecordChange(props.column.id, newValue?.id ?? newValue);
              }}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  key={props.column.id+"_autocomplete_textField"}
                  //autoFocus={index === start === 0} //First, add autofocus 
                  name={props.column.id}
                  label={props.column.header}
                  fullWidth
                  //disabled={column.templatable === true && object.templateId !== Constants.GUID_EMPTY}
                  margin="normal" 
                  variant="outlined" 
                  //helperText={props.column.helperText}
                  size="small"
                  //error={props.column.errorFunc !== undefined ? props.column?.errorFunc(props.object[props.column.id]) : null} 
                />}
            />
          
        )
}

export default FormAutoCompleteFree;
