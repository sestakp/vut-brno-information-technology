/**
 * Author: Pavel Šesták
 */
import FormAutoComplete from "../../components/FormAutoComplete/FormAutoComplete";
import FormAutoCompleteFree from "../../components/FormAutoCompleteFree/FormAutoCompleteFree";

import { TextField, FormControlLabel, Checkbox } from "@material-ui/core";

import { useFormContext, Controller } from "react-hook-form";
import Dropzone from "../../components/Dropzone/Dropzone";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "date-fns";
import Moment from "react-moment";
import FileUploader from "../../components/FileUploader/FileUploader";
import { NavLink } from "react-router-dom";

export const dataSettingTypes = {
  INPUT: "INPUT",
  DROPZONE: "DROPZONE",
  IMAGE: "IMAGE",
  ATTACHMENT: "ATTACHMENT",
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
  start,
  stop,
  object,
  dataSettings,
  methods,
  isOwner
) {
  return dataSettings.slice(start, stop).map((column, index) => {

    //Field just for admin or owner
    if(!isOwner && column.ownerField) { return ""}

    let rules = {}
    if(column.rules !== undefined){
      rules = column.rules(methods.getValues);
    }

    if(object === undefined) { return ""}

    switch (column.type) {
      case dataSettingTypes.INPUT:
        return (
            <Controller
              key={column.id}    
              name={column.id}
              control={methods.control}
              defaultValue={object !== undefined ? object[column?.id] ?? "" : ""}
              rules={rules}
              render={({ field: { onChange, value } }) => (
                <TextField
                  //{...methods.register(column.id, column.constraints)}
                  autoFocus={(index === start) === 0} //First, add autofocus
                  value={value}
                  onChange={onChange}
                  label={column.header + (rules?.required !== undefined ? " *" : "")}
                  fullWidth
                  margin="normal"
                  size="small"
                  variant="outlined"
                  helperText={methods.formState?.errors[column.id]?.message ?? ""}
                  error={ methods.formState.errors[column.id] !== undefined}
            />
              )}
            />
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
      case dataSettingTypes.ATTACHMENT:

        if(object === undefined) { return ""}

        return (
          <div key={column.id}>
          <label>{column.header}</label>
          <FileUploader
            styles={{
              dropzone: {
                margin: 0,
                marginTop: "16px",
                marginBottom: "8px",
                padding: 0,
              },
            }}
            classNames="dropZone"
            maxFiles={1}
            fieldName={column.id}
            value={object[column.id]}
          />
          </div>
        )

      case dataSettingTypes.IMAGE:
        if(object === undefined) { return ""}
        return (
          <div 
          key={column.id}
          >
          <label>{column.header}</label>
          <Dropzone
            styles={{
              dropzone: {
                margin: 0,
                marginTop: "16px",
                marginBottom: "8px",
                padding: 0,
              },
            }}
            classNames="dropZone"
            maxFiles={1}
            fieldName={column.id}
            value={object[column.id]}
          />
          </div>
        );

      case dataSettingTypes.SELECT:
        return (
            <Controller
              key={column.id}    
              name={column.id}
              control={methods.control}
              defaultValue={object !== undefined ? object[column?.id] ?? "" : ""}
              rules={rules}
              render={({ field: { onChange, value } }) => (
                <FormAutoComplete
                  key={column.id}
                  column={column}
                  object={object}
                  handleRecordChange={onChange}
                  value={value}
                  methods={methods}
                  disable={column.disable}
                />
              )}
            />          
        );

      case dataSettingTypes.AUTOCOMPLETE:
        return (
          <FormAutoCompleteFree
            key={column.id}
            column={column}
            object={object}
          />
        );
      
      case dataSettingTypes.LINK:

        let val = object[column.selectDataProviderId].filter(x => x.id === object[column.id])[0]?.name;
        return (
          <Controller
            key={column.id}    
            name={column.id}
            control={methods.control}
            defaultValue={object !== undefined ? object[column.id] ?? "" : ""}
            rules={rules}
            render={({ field: { onChange, value } }) => {
              return (
              <TextField
                value={val}
                onChange={onChange}
                label={column.header + (rules?.required !== undefined ? " *" : "")}
                fullWidth
                InputProps={{ readOnly: true, }}
                InputLabelProps={{ shrink: true }}
                margin="normal"
                size="small"
                variant="outlined"
                helperText={methods.formState?.errors[column.id]?.message ?? ""}
                error={ methods.formState.errors[column.id] !== undefined}
          />
            )}}
          />
      );

      case dataSettingTypes.DATETIME:
        //On edit when datetime is parsed like string, data must be converted into date
        if (typeof object[column.id] === "string" && object[column.id] !== "") {
          object[column.id] = parseISO(object[column.id]);
        }
        
        var keys = column.minDateId?.split('.');
        var minObj = object;
        var minKey = column.minDateId;
        for(let i = 0; i < (keys?.length -1); i++){
        
          minKey = keys[i];
          minObj = minObj[minKey];
          minKey = keys[i+1];
        }

        keys = column.maxDateId?.split('.');
        var maxObj = object;
        var maxKey = column.maxDateId;
        for(let i = 0; i < (keys?.length -1); i++){
          maxKey = keys[i];
          maxObj = maxObj[maxKey];
          maxKey = keys[i+1];
        }

        return (
            <Controller
            key={column.id}
            name={column.id}
            control={methods.control}
            defaultValue={object[column.id] ?? ""}
            rules={rules}
            render={({field: { onChange, value }}) => (
                <DatePicker
                    selected={value}
                    onChange={onChange}
                    minDate={ minObj !== undefined ? parseISO(minObj[minKey]) : null}
                    maxDate={maxObj !== undefined ? parseISO(maxObj[maxKey]) : null}
                    placeholderText={column.label}
                    className="datePicker formDatePicker"
                    showTimeSelect
                    timeIntervals={60}
                    dateFormat="Pp"
                    customInput={
                        <TextField 
                            fullWidth     
                            label={column.header + (rules?.required !== undefined ? " *" : "")}
                            margin="normal"
                            size="small"
                            variant="outlined"                  
                            helperText={methods.formState?.errors[column.id]?.message ?? ""}
                            error={ methods.formState.errors[column.id] !== undefined}
                        />}
                />
            )}
            />)
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
  start,
  stop,
  object,
  dataSettings,
) {

  return dataSettings.slice(start, stop).map((column, index) => {

    var keys = column.id.split('.');
    var obj = object;
    var key = column.id;
    for(let i = 0; i < (keys.length -1); i++){
        key = keys[i];
        obj = obj[key];
        key = keys[i+1];
    }

    if(obj === undefined || obj === null){
      return "";
    }

    switch (column.type) {
      case dataSettingTypes.INPUT:

        return (
          <div className="border-bottom p-3" key={key}>
            <p className="m-0 text-neutral-400">{column.header}</p>
            <p className="m-0" style={{wordBreak: "break-word"}}>{obj[key]}</p>
          </div>  
        );

      case dataSettingTypes.CHECKBOX:
        return (
          ""
        );
      case dataSettingTypes.IMAGE:
        let imageSrc = (obj[key] === undefined || obj[key] === null) ? "/~xsesta07/IIS/defaultImage.png" : process.env.REACT_APP_API_URL.slice(0, -1) + obj[key]
          
        return (
          <div className="border-bottom p-3" key={key}>
            <p className="m-0 text-neutral-400">{column.header}</p>
            <img src={imageSrc} className="mw-100" style={{maxHeight: "200px"}} alt="person card"/>
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
        return (
          <div className="border-bottom p-3" key={key}>
            <p className="m-0 text-neutral-400">{column.header}</p>
            <Moment className="m-0" format="DD. MMMM YYYY hh:mm A">{obj[key]}</Moment>
          </div>  
        );
      
      case dataSettingTypes.ATTACHMENT:
        return(
          <div className="border-bottom p-3" key={key}>
          <p style={{color: "#666"}} className="m-0">{column.header}</p>
          <p className="m-0"><a href={process.env.REACT_APP_API_URL.slice(0, -1)+obj[key]} download>{obj[key]}</a></p>
        </div>  
        )
      case dataSettingTypes.LINK:
        return(
          <div className="border-bottom p-3" key={key}>
            <p style={{color: "#666"}} className="m-0">{column.header}</p>
            <p className="m-0">
              {obj !== undefined && <NavLink to={column.path + ((column.suffix_id !== undefined && obj !== undefined && obj !== null) ? (obj[column.suffix_id] ?? "") : "")}>{obj[key]}</NavLink>}
            </p>
          </div>  
        )

      default:
        console.error("LibraryBase at line 287, default in case!");
        return "";
    }
  });
}

