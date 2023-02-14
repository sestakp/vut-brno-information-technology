/**
 * Author: Lukáš Plevač
 */
import React, { useEffect, useState} from 'react';
import TableCell from "@material-ui/core/TableCell";
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import userClient from '../../../../api/userClient';
import { setNotification } from '../../../../redux/notifications/notificationActions';
import { setCurrentUser } from '../../../../redux/users/userActions';
import CancelIcon from '@mui/icons-material/Cancel';

export default function EditableCellRole(props){
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(props.user);
    const [value, setValue] = useState(props.user[props.name]);
    const [storeData, setStoreData] = useState(false);
    const dispatch = useDispatch();

    useEffect(async () => {
        if(storeData){
            if(user[props.name] !== value){

                let usr = user;
                usr[props.name] = value;
                usr.old_email = props.user.email;
                await userClient.updateUser(usr);
                dispatch(
                    setNotification({
                        message: 'Role for user '+usr.name+' set',
                        status: 'SUCCESS',
                        show: true,
                    })
                );
                /*dispatch(
                    setCurrentUser(usr)
                );*/
            }
        }

        setStoreData(false);
        
    }, [value, storeData])


    function changeState(){
        if(user.role !== "guest"){

            if(isEditing){
                setStoreData(true);
            }
            setIsEditing(!isEditing);
        }
    }

    function onChange(e){
        setValue(e.nativeEvent.target.value)
    }

    function handleInputChange(event, value) {
        setValue(value);
        changeState();
    }


    if(isEditing){

        return(
            <TableCell>
                <span style={{cursor: "pointer"}} className={`badge ${user.role === "admin" ? "bg-info" : "bg-secondary"}`} onClick={() => handleInputChange(null,'admin')}>admin</span>
                <span style={{cursor: "pointer"}} className={`badge ${user.role === "user" ? "bg-info" : "bg-secondary"}`} onClick={() => handleInputChange(null,'user')}>user</span>
                <CancelIcon style={{cursor: "pointer"}} onClick={changeState}/>
            </TableCell>
        )


    }
    else{
        return(
            <TableCell onDoubleClick={changeState}>
                <span className="badge bg-info">{value}</span>
            </TableCell>
        )
    }
}