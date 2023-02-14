/**
 * Author: Vojtěch Kulíšek
 */
import React, { useEffect, useState} from 'react';
import TableCell from "@material-ui/core/TableCell";
import TextField from '@material-ui/core/TextField';
import { useDispatch, useSelector } from 'react-redux';
import userClient from '../../../../api/userClient';
import { setNotification } from '../../../../redux/notifications/notificationActions';
import { setCurrentUser } from '../../../../redux/users/userActions';

export default function EditableCellDefault(props){
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(props.user);
    const [value, setValue] = useState(props.user[props.name]);
    const dispatch = useDispatch();


    async function persistData(){
        if(user[props.name] !== value){
            let usr = user;
            usr.old_email = props.user.email;
            usr[props.name] = value;
            await userClient.updateUser(usr);
            dispatch(
                setNotification({
                    message: props.name + ' for user '+usr.name+' set',
                    status: 'SUCCESS',
                    show: true,
                })
            );
        }
    }


    function changeState(){
        if(isEditing){
            persistData();
        }
        setIsEditing(!isEditing);
    }

    function onChange(e){
        setValue(e.nativeEvent.target.value)

    }

    function handleInputChange(event, value) {
        setValue(value)
        changeState();

    }


    if(isEditing){

        return(
            <TextField value={value} onBlur={changeState} autoFocus onChange={onChange} style={{padding: "16", verticalAlign: "middle"}}/>
        )


    }
    else{
        return(
            <TableCell onDoubleClick={changeState}>
                {value}
            </TableCell>
        )
    }
}