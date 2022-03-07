import FormAutoComplete from "../../components/FormAutoComplete/FormAutoComplete";
import FormAutoCompleteFree from "../../components/FormAutoCompleteFree/FormAutoCompleteFree";

import { TextField, FormControlLabel, Checkbox } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { useFormContext, Controller, UseFormReturn, FieldValues } from "react-hook-form";
import Dropzone from "../../components/Dropzone/Dropzone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import DataSettingColumn from "../../models/utils/renderUtils/DataSettingColumn";
import Rules from "../../models/utils/renderUtils/Rules";
import getImagePath from "../getImagePath";
import Moment from "react-moment";

export const dataSettingTypes = {
  INPUT: "INPUT",
  DROPZONE: "DROPZONE",
  IMAGE: "IMAGE",
  SELECT: "SELECT",
  CHECKBOX: "CHECKBOX",
  AUTOCOMPLETE: "AUTOCOMPLETE",
  DATETIME: "DATETIME",
  LINK: "LINK",
};

/**
 * Render n field of form, defined in dataSettings
 * @param {number} start start index of dataSettings to render
 * @param {number} stop last index of dataSettings to render
 * @param {object} object object which represent data and correspond with dataSettings scheme
 * @param {object} dataSettings information about data specified in concrete model library
 * @param {object} methods methods from hook UseForm()
 * @returns Rendered form
 */
export function renderForm(
  start: number,
  stop: number,
  object: {[key: string]: any},
  dataSettings: DataSettingColumn[],
  methods: UseFormReturn<FieldValues, object>
) {
  return dataSettings.slice(start, stop).map((column, index) => {

    let rules: Rules = {};

    if(column.rules !== undefined){
      rules = column.rules(methods.getValues);
    }
    
    if(object === undefined) { return ""}

    switch (column.type) {


      case dataSettingTypes.INPUT:
        return (
          <>
            <Controller
              key={column.id}    
              name={column.id as any}
              control={methods.control}
              defaultValue={object !== undefined ? object[column?.id] ?? "" : ""}
              rules={rules}
              render={({ field: { onChange, value } }) => (
                <TextField
                  //{...methods.register(column.id, column.constraints)}
                  //autoFocus={(index === start) === 0} //First, add autofocus
                  value={value}
                  onChange={onChange}
                  label={column.header + (rules?.required !== undefined ? " *" : "")}
                  fullWidth
                  multiline
                  margin="normal"
                  size="small"
                  variant="outlined"
                  helperText={methods.formState?.errors[column.id]?.message ?? ""}
                  error={ methods.formState.errors[column.id] !== undefined}
            />
              )}
            />
          </>
        );

      case dataSettingTypes.CHECKBOX:
        return (
          <FormControlLabel
            key={column.id}
            style={{ padding: "0", margin: "0", height: "60px", width: "100%" }}
            label={column.header}
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
        if(object === undefined) { return ""}
        return (
          <Dropzone
            key={column.id}
            fieldName={column.id as any}
            value={object[column.id]}
            multiple={false}
          />
        );

      case dataSettingTypes.SELECT:
        return (
            <Controller
              key={column.id}    
              name={column.id as any}
              control={methods.control}
              defaultValue={object !== undefined ? object[column?.id] ?? "" : ""}
              rules={rules}
              render={({ field: { onChange, value } }) => (
                <FormAutoComplete
                  value={value}
                  key={column.id}
                  column={column}
                  object={object}
                  handleRecordChange={onChange}
                  methods={methods}
                />
              )}
            /> 
        );

      case dataSettingTypes.AUTOCOMPLETE:
      return(
        <Controller
        key={column.id}    
        name={column.id as any}
        control={methods.control}
        defaultValue={object !== undefined ? object[column?.id] ?? "" : ""}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <FormAutoCompleteFree
            key={column.id}
            column={column}
            object={object}
            handleRecordChange={onChange}
          
          />
        )}
      />
      )

      case dataSettingTypes.DATETIME:
        //On edit when datetime is parsed like string, data must be converted into date
        
        if(object[column.id] === "0001-01-01T00:00:00"){
          object[column.id] = "";
        }

        if (typeof object[column.id] === "string" && object[column.id] !== "") {
          

          object[column.id] = parseISO(object[column.id]);
        }
        

        return (
            <> 
            <Controller
            key={column.id}
            name={column.id as any}
            control={methods.control}
            defaultValue={object[column.id] ?? ""}
            rules={rules}
            render={({field: { onChange, value }}) => (
                <DatePicker
                    selected={value}
                    onChange={onChange}
                    placeholderText={column.header}
                    className="datePicker formDatePicker"
                    showTimeSelect
                    dateFormat="Pp"
                    timeIntervals={60}
                    customInput={
                        <TextField 
                            fullWidth     
                            multiline
                            label={column.header + (rules?.required !== undefined ? " *" : "")}
                            margin="normal"
                            size="small"
                            variant="outlined"                  
                            helperText={methods.formState?.errors[column.id]?.message ?? ""}
                            error={ methods.formState.errors[column.id] !== undefined}
                        />}
                />
            )}
            />
            </>)
      default:
        console.error("LibraryBase at line 287, default in case!");
        return "";
    }
  });
}








/**
 * Render n field of detail, defined in dataSettings
 * @param {number} start start index of dataSettings to render
 * @param {number} stop last index of dataSettings to render
 * @param {object} object object which represent data and correspond with dataSettings scheme
 * @param {object} dataSettings information about data specified in concrete model library
 * @returns Rendered form
 */
 export function renderDetail(
  start: number,
  stop: number,
  object: {[key: string]: any},
  dataSettings: DataSettingColumn[]
) {
  return dataSettings.slice(start, stop).map((column, index) => {
    switch (column.type) {

      case dataSettingTypes.LINK:
        return(
          
          <div className="border-bottom p-3">
            <p style={{color: "#666"}} className="m-0">{column.header}</p>
            <p className="m-0">
              <NavLink to={column.path + (column.suffix_id !== undefined ? object[column.suffix_id] : "")}>{object[column.id]}</NavLink>  
            </p>
          </div>  
        )
      case dataSettingTypes.INPUT:
        
        return (
          <div className="border-bottom p-3">
            <p style={{color: "#666"}} className="m-0">{column.header}</p>
            <p className="m-0">{object[column.id]}</p>
          </div>  
        );

      case dataSettingTypes.CHECKBOX:
        return (
          ""
        );
      case dataSettingTypes.IMAGE:
        let imageSrc = getImagePath(object[column.id])

        return (
          <div className="border-bottom p-3">
            <p style={{color: "#666"}} className="m-0">{column.header}</p>
            <img src={imageSrc} className="mw-100" style={{maxHeight: "200px"}} alt="player card"/>
          </div>
        );

      case dataSettingTypes.SELECT:
        return (
          ""
        );

      case dataSettingTypes.AUTOCOMPLETE:
        return (
          ""
        );

      case dataSettingTypes.DATETIME:
        return(
          <div className="border-bottom p-3">
            <p style={{color: "#666"}} className="m-0">{column.header}</p>
            <p className="m-0"><Moment format="DD.MM.YYYY hh:mm A">{object[column.id]}</Moment></p>
          </div>
        )

      default:
        console.error("LibraryBase at line 287, default in case!");
        return "";
    }
  });
}

