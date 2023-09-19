import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useRef } from "react";
const EditableParagraph = (props) => {

    const [value, setValue] = React.useState(props.value)

    const [isEditing, setIsEditing] = React.useState(false)
    const textFieldRef = useRef()
    function handleSubmit(){

        if(props.onApprove !== undefined){
            props.onApprove(value)
        }
        setIsEditing(false)
    }

    function handleClose(){
        setValue(props.value)
        setIsEditing(false)
    }

    if(isEditing){
        return(
        <TextField 
            ref={textFieldRef}
            variant="standard" 
            fullWidth
            type={props.type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            multiline
            InputProps={{
                endAdornment: <InputAdornment position="end">
                                {isEditing ? 
                                    <>
                                        <CheckIcon onClick={() => handleSubmit()}/>
                                        <CloseIcon onClick={() => handleClose()}/>
                                    </>
                                     : 
                                    <EditIcon onClick={() => setIsEditing(true)}/>}
                                </InputAdornment>,
                startAdornment: <InputAdornment position="start">
                                {props.inputAdornment ?? ""}
                                </InputAdornment>
              }}
        />
        )
    }
    
    return(
        <p>{props.inputAdornment ?? ""}{props.value}<EditIcon onClick={() => setIsEditing(true)}/></p>
    )
}

export default EditableParagraph;