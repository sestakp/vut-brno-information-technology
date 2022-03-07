/**
 * Author: Lukáš Plevač
 */
import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

function FormAutoComplete(props) {
  let options =
    props.object[props.column.selectDataProviderId] ??
    props.column.selectDataProvider;

  if (props.column.defaultSelectText) {
    options.unshift({
      label: props.column.defaultSelectText,
      establishmentTypeName: "Bez nadřazeného druhu soupravy",
    });
  }

  if (props.column.groupById !== undefined) {
    options = options.sort((a, b) =>
      a[props.column.groupById]?.localeCompare(b[props.column.groupById])
    );
  }

  function getOptionLabel(option) {
    let retval = option.code ?? option.name ?? option;
    return String(retval);
  }

  function getOptionSelected(option, value) {
    return option?.id === value?.id || option === value;
  }


  let value = props.value ?? props.object[props.column.id];
  value = options?.find((x) => x.id === value || x === value);

  return (
    <Autocomplete
      name={props.column.id}
      key={props.column.id + "_autocomplete"}
      options={options}
      groupBy={(option) => option[props.column.groupById]}
      getOptionLabel={getOptionLabel}
      getOptionSelected={getOptionSelected}
      disableClearable={props.disable}
      value={value ?? props.value}
      onChange={onChange}
      renderInput={renderInput}
      renderOption={renderOption}
      size="small"
    />
  );

  function onChange(event, newValue) {
    props.handleRecordChange(newValue?.id ?? newValue);
  }

  function renderOption(option, { inputValue }) {
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

  function renderInput(params) {

    let rules = props.column.rules(props.methods.getValues);
    return (
      <TextField
        {...params}
        key={props.column.id + "_autocomplete_textField"}
        onChange={props.handleInputChange}
        name={props.column.id}
        label={props.column.header + (rules?.required !== undefined ? " *" : "")}
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
