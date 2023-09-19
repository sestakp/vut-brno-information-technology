import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import isMobilePhone from "validator/lib/isMobilePhone";
import isEmail from "validator/lib/isEmail";
import isPostalCode from "validator/lib/isPostalCode";
import "./EditableTextField.css"
import isAlphanumeric from "validator/lib/isAlphanumeric";
const EditableTextField = (props) => {


    const [value, setValue] = React.useState(props.value)
    const [value2, setValue2] = React.useState(props.value)

    const [isEditing, setIsEditing] = React.useState(false)
    
    function hasError(){
        if (props.type == "password"){
            if(value !== value2){
                return "Password not match"
            }

            if(value === ""){
                return "Password isn't set"
            }
        }
        else if (props.type == "tel"){

            if(value === "" || value === undefined || value === null){
                return false;
            }

            if(! isMobilePhone(value, 'cs-CZ')){
                return "Wrong format of phone number"
            } 
        }
        else if(props.type == "bankAccount"){
            if(value === "" || value === undefined){
                return false;
            }
            const regex = /^\d{1,10}\/\d{4}$/;
            const hasError = !regex.test(value);

            if(hasError){
                return "Wrong format of bank account"
            } 
        }
        else if(props.type == "zipCode"){
            if(value === "" || value === undefined){
                return false;
            }

            if(! isPostalCode(value, "CZ")){
                return "Wrong format postal code"
            } 
        }
        else if(props.type == "email"){
            if(value === "" || value === undefined){
                return false;
            }
            if(! isEmail(value)){
                return "Wrong email format"
            }
        }
        else{
            if(value === "" || value === undefined){
                return false;
            }
            if(! isAlphanumeric(value, "cs-CZ",{ignore: " "})){
                return "Only alpha numeric values are allowed"
            }
        }



        return false
    }

    function handleSubmit(){

        if( hasError()){
            return;
        }

        if(props.onUpdate !== undefined){
            
            props.onUpdate(value)
        }
        setIsEditing(false)
    }

    function handleClose(){
        setValue(props.value)
        setIsEditing(false)
    }

    let passwordAgain = ""
    if(isEditing && props.type === "password"){
        passwordAgain = <TextField 
        variant="standard" 
        fullWidth
        style={{marginRight: "15px", marginTop: "17px"}}
        onChange={((e) => setValue2(e.target.value))}
        value={value2}
        InputProps={{
            readOnly: !isEditing,
            
          }}
        type={props.type}
        error={hasError()}
        helperText={hasError()}
    />
    }
    
    return(
        <>
        {passwordAgain}
        <TextField 
            variant="standard" 
            fullWidth
            type={props.type}
            value={value}
            onChange={((e) => setValue(e.target.value))}
            label={isEditing && props.type === "password" ? "Password again" : ""}
            error={hasError()}
            helperText={hasError()}
            InputProps={{
                readOnly: !isEditing,
                endAdornment: <InputAdornment position="end">
                                {isEditing ? 
                                    <>
                                        <CheckIcon onClick={() => handleSubmit()}/>
                                        <CloseIcon onClick={() => handleClose()}/>
                                    </>
                                     : 
                                    <EditIcon onClick={() => setIsEditing(true)}/>}
                                </InputAdornment>,
              }}
        />
        </>        
    )
}

export default EditableTextField;