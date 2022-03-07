import React, { Component } from 'react';
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as Constants from "../../libraries/Common";


export default class FormAutoCompleteFree extends Component {
    constructor(props) {
        super(props);

        let options = this.props.object[this.props.column.optionsId] ?? this.props.column.optionDataProvider

        if(this.props.column.defaultSelectText){
            options.unshift({id: Constants.GUID_EMPTY, label: this.props.column.defaultSelectText});
        }

        this.state = {
            column: this.props.column,
            options: options
        }
    }

  render() {
      let value = this.props.object[this.props.column.id];
      return (
            <Autocomplete
              name={this.state.column.id}  
              key={this.state.column.id+"_autocomplete"}
              options={this.state.options}  
              getOptionLabel={(option) => option.label ?? option.contractAbbreviation ?? option.nameNew ?? option.name ?? option}
              getOptionSelected={(option, value) => option?.id === value?.id}
              value={this.state.options.find(x => x.id === value) ?? value}
              defaultValue={this.state.options.find(x => x.id === value) ?? value}
              freeSolo
              size="small"
              onChange={(event, newValue) => {
                this.props.handleRecordChange(this.state.column.id, newValue?.id ?? newValue);
              }}
              renderInput={(params) => 
                <TextField 
                  {...params} 
                  key={this.state.column.id+"_autocomplete_textField"}
                  //autoFocus={index === start === 0} //First, add autofocus 
                  onChange={this.props.handleInputChange}
                  name={this.state.column.id}
                  label={this.state.column.label}
                  fullWidth
                  //disabled={column.templatable === true && object.templateId !== Constants.GUID_EMPTY}
                  margin="normal" 
                  variant="outlined" 
                  helperText={this.state.column.helperText}
                  size="small"
                  error={this.state.column.errorFunc !== undefined ? this.state.column?.errorFunc(this.props.object[this.state.column.id]) : null} 
                />}
            />
          
        )
      }
}
