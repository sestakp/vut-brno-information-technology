import React, { Component } from 'react';
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import * as Constants from "../../libraries/Common";
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

export default class FormAutoComplete extends Component {
    constructor(props) {
        super(props);

        let options = this.props.object[this.props.column.selectDataProviderId] ?? this.props.column.selectDataProvider

        if(this.props.column.defaultSelectText){
            options.unshift({id: Constants.GUID_EMPTY, label: this.props.column.defaultSelectText, establishmentTypeName: "Bez nadřazeného druhu soupravy"});
        }

        if(this.props.column.groupById !== undefined){
          options = options.sort((a, b) => a[this.props.column.groupById]?.localeCompare(b[this.props.column.groupById]));
        }

        this.state = {
            column: this.props.column,
            options: options
        }

        this.onChange = this.onChange.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.renderInput = this.renderInput.bind(this);
    }

  render() {
      let value = this.state.options.find(x => x.id === this.props.object[this.props.column.id]);

      return (
            <Autocomplete
              name={this.state.column.id}  
              key={this.state.column.id+"_autocomplete"}
              options={this.state.options}
              groupBy={(option) => option[this.state.column.groupById]}
              getOptionLabel={FormAutoComplete.getOptionLabel}
              getOptionSelected={FormAutoComplete.getOptionSelected}
              value={value}
              onChange={this.onChange}
              renderInput={this.renderInput}
              renderOption={this.renderOption}
              size="small"
            />
        )
      }
    
  onChange(event, newValue){
    this.props.handleRecordChange(this.state.column.id, newValue?.id ?? newValue);
  }

  renderOption(option, { inputValue }){
    let label = option.label ?? option.contractAbbreviation ?? option.nameNew ?? option.name ?? option;
    
    const matches = match(label, inputValue);
    const parts = parse(label, matches);
    
    //prevent match default value
    if(inputValue === this.props.column.defaultSelectText){
      return(
        <div>
          {label}
        </div>
      )
    }

    return (
      <div>
        {parts.map((part, index) => (
          <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
            {part.text}
          </span>
        ))}
      </div>
    );
  }

  renderInput(params){
    return(
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
        error={this.state.column.errorFunc !== undefined ? this.state.column?.errorFunc(this.state.object[this.state.column.id]) : null} 
    />
    )
  }

  static getOptionLabel(option){
    return  option.label ?? option.contractAbbreviation ?? option.nameNew ?? option.name ?? option;
  }

  static getOptionSelected(option, value){
    return option?.id === value?.id;
  }
}
