
import FormAutoComplete from "../components/FormAutoComplete/FormAutoComplete";
import FormAutoCompleteFree from "../components/FormAutoCompleteFree/FormAutoCompleteFree";

import { TextField, FormControlLabel, Checkbox } from "@material-ui/core";

import { useFormContext, Controller } from "react-hook-form";
//import Dropzone from 'react-dropzone-uploader';
import Dropzone from "../components/Dropzone/Dropzone";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DatePicker, { registerLocale } from "react-datepicker";
import cs from "date-fns/locale/cs"; //locale for datepicker
import { parseISO } from "date-fns";

export const dataSettingTypes = {
  INPUT: "INPUT",
  DROPZONE: "DROPZONE",
  IMAGE: "IMAGE",
  SELECT: "SELECT",
  CHECKBOX: "CHECKBOX",
  AUTOCOMPLETE: "AUTOCOMPLETE",
  DATETIME: "DATETIME",
};

///TODO... refactors
export function GenerateColumns(record) {
  switch (record.type) {
    case dataSettingTypes.IMAGE:
      return {
        accessor: record.id,
        Header: record.header,
      };

    case dataSettingTypes.CHECKBOX:
      return {
        accessor: record.id,
        header: record.header,
      };

    case dataSettingTypes.DATETIME:
      return {
        accessor: record.id,
        header: record.header,
      };

    case dataSettingTypes.AUTOCOMPLETE:
      return {
        accessor: record.id,
        header: record.header,
      };

    case dataSettingTypes.SELECT:
      return {
        accessor: record.id,
        header: record.header,
      };

    default:
      return { accessor: record.id, header: record.header };
  }
}

/**
 * Render n field of form, defined in dataSettings
 * @param {number} start start index of dataSettings to render
 * @param {number} stop last index of dataSettings to render
 * @param {object} object object which represent data and correspond with dataSettings scheme
 * @param {function} handleInputChange This function is called when input is changed
 * @param {function} handleCheckboxChange This function is called when some checkbox is changed
 * @param {function} HandleImageDropzoneChange This function is called when someone add/delete image
 * @param {FileList} initialImage List with File of image, which be default added to dropzone
 * @param {object} dataSettings information about data specified in concrete model library
 * @param {function} HandleChangeDatepicker This function is called when some datepicker is changed
 * @param {function} handleRecordChange TODO...
 * @returns Rendered form
 */
export function renderForm(
  start,
  stop,
  object,
  handleInputChange,
  handleCheckboxChange,
  HandleImageDropzoneChange,
  initialImage,
  dataSettings,
  HandleChangeDatepicker,
  handleRecordChange,
  methods
) {
  return dataSettings.slice(start, stop).map((column, index) => {
    switch (column.type) {
      case dataSettingTypes.INPUT:
        
        return (
          <>
            <Controller
              name={column.id}
              control={methods.control}
              defaultValue={object[column.id]}
              //rules={{ required: "First name required" }}
              render={({ field: { onChange, value } }) => (
                <TextField
                  //{...methods.register(column.id, column.constraints)}
                  key={column.id}
                  autoFocus={(index === start) === 0} //First, add autofocus
                  value={value}
                  onChange={onChange}
                  label={column.header}
                  fullWidth
                  multiline
                  margin="normal"
                  size="small"
                  variant="outlined"
                  helperText={column.helperText}
                  error={
                    column.errorFunc !== undefined
                      ? column?.errorFunc(object[column.id])
                      : null
              }
            />
              )}
            />
            {/*
                        <TextField
              //{...methods.register(column.id, column.constraints)}
              key={column.id}
              autoFocus={(index === start) === 0} //First, add autofocus
              defaultValue={object[column.id]}
              label={column.header}
              fullWidth
              multiline
              margin="normal"
              size="small"
              variant="outlined"
              helperText={column.helperText}
              error={
                column.errorFunc !== undefined
                  ? column?.errorFunc(object[column.id])
                  : null
              }
            />
            */}

          </>
        );

      case dataSettingTypes.CHECKBOX:
        return (
          <FormControlLabel
            key={column.id}
            style={{ padding: "0", margin: "0", height: "60px", width: "100%" }}
            label={column.label}
            size="small"
            control={
              <Checkbox
                size="small"
                value={object[column.id]}
                checked={object[column.id]}
                name={column.id}
                color="default"
              />
            }
          />
        );
      case dataSettingTypes.IMAGE:
        return (
          <Dropzone
            styles={{
              dropzone: {
                margin: 0,
                marginTop: "16px",
                marginBottom: "8px",
                padding: 0,
              },
            }}
            key={column.id}
            classNames="dropZone"
            maxFiles={1}
            initialFile={initialImage}
            fieldName={column.id}
            value={object[column.id]}
          />
        );

      case dataSettingTypes.SELECT:
        return (
          <FormAutoComplete
            key={column.id}
            column={column}
            object={object}
            handleRecordChange={handleRecordChange}
          />
        );

      case dataSettingTypes.AUTOCOMPLETE:
        return (
          <FormAutoCompleteFree
            key={column.id}
            column={column}
            object={object}
            handleRecordChange={handleRecordChange}
            handleInputChange={handleInputChange}
          />
        );

      case dataSettingTypes.DATETIME:
        //On edit when datetime is parsed like string, data must be converted into date
        if (typeof object[column.id] === "string" && object[column.id] !== "") {
          object[column.id] = parseISO(object[column.id]);
        }

        return (
          <DatePicker
            key={column.id}
            className="datePicker formDatePicker"
            placeholderText={column.label}
            selected={object[column.id]}
            onChange={(date) => HandleChangeDatepicker(date, column.id)}
            value={object[column.id]}
            locale="cs"
          />
        );
      default:
        console.error("LibraryBase at line 287, default in case!");
        return "";
    }
  });
}
