import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import DataSettingColumn from "../../models/utils/renderUtils/DataSettingColumn";
import Model from "../../models/api/Model";
import Option from "../../models/components/FormAutoComplete/Option";
import Constants from "../../utils/Constants";
import { UseFormReturn, FieldValues } from "react-hook-form";

interface Props{
  column: DataSettingColumn,
  value: string,
  object: {[key: string]: any },
  handleRecordChange: (value: any) => void,
  methods: UseFormReturn<FieldValues, object>,
}


function FormAutoComplete(props: Props) {

  let options: Option[] = [];
  
  if(props.column.selectDataProviderId !== undefined){
    options = props.object[props.column.selectDataProviderId];
  }
  else if(props.column.selectDataProvider !== undefined){
    options = props.column.selectDataProvider;
  }

  if (props.column.defaultSelectText !== undefined) {
    options.unshift({
      id: Constants.GUID_EMPTY,
      selectText: props.column.defaultSelectText,
    });
  }


  function getOptionLabel(option: any):string {
    return option.selectText ?? "";
  }

  function getOptionSelected(option: Option, value: any) {
    return option?.id === value?.id;
  }

  let value:Option | undefined = {id: Constants.GUID_EMPTY, };

  if(options !== undefined){
    value = options.find((x) => x.id === props.object[props.column.id]);
  }
  else{
    options = [];
  }

  return (
    <Autocomplete
      key={props.column.id + "_autocomplete"}
      options={options}
      groupBy={(option) => props.column.groupById !== undefined ? option[props.column.groupById] : "" }
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      defaultValue={value}
      onChange={onChange}
      renderInput={renderInput}
      renderOption={renderOption}
      size="small"
    />
  );

  function onChange(event:any, newValue: Option | null) {
    props.handleRecordChange(newValue?.id ?? newValue);
  }

  function renderOption(option: Option, { inputValue }:{ inputValue: string}) {
    let label = getOptionLabel(option);

    const matches = match(label, inputValue);
    const parts = parse(label, matches);

    //prevent match default value
    if (inputValue === props.column.defaultSelectText) {
      return <div>{label}</div>;
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

  function renderInput(params:any) {
    return (
      <TextField
        {...params}
        key={props.column.id + "_autocomplete_textField"}
        name={props.column.id}
        label={props.column.header}
        fullWidth
        margin="normal"
        variant="outlined"
        helperText={props.methods.formState?.errors[props.column.id]?.message ?? ""}
        error={ props.methods.formState.errors[props.column.id] !== undefined}
      />
    );
  }

}


export default FormAutoComplete;
