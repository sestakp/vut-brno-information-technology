import getBaseActions from "../base/ActionBase";
import noteTypes from "./noteTypes";
import noteClient from "../../api/NoteClient";
import { setNotification } from "../notifications/notificationActions";
import userActions from "../users/userActions";
import reservationTypes from "../reservations/reservationTypes";
import reservationActions from "../reservations/reservationActions";

let noteActions = getBaseActions(noteTypes, noteClient, "notes");

noteActions.setTextForNewNote = (data) => async(dispatch) => {
    dispatch({
        type: noteTypes.SET_TEXT_NEW_NOTE,
        payload: data
    });
}

noteActions.createNewNote = (note, reservationId, roomId) => async(dispatch) => {
   
    let response = await noteClient.create({...note, reservationId, roomId})

    if(response.status === 200 && response.data != -1){
        
        dispatch(setNotification({
            message: "Note created",
            status: "success",
            show: true,
        }))
        
        dispatch(userActions.addNoteToReservation(note, roomId, reservationId))
    }
    else{
        dispatch(setNotification({
            message: "Note wasn't created",
            status: "error",
            show: true,
        }))
    }
}


noteActions.updateField =  (id, fieldName, value) => async (dispatch) => {
    try {
        await noteClient.updateField({ id, fieldName, value });
        dispatch(reservationActions.updateNoteForReservations(id, fieldName, value));

        dispatch(
            setNotification({
                message: "Note updated sucessfully",
                status: "success",
                show: true,
            })
        );


    } catch (FAILs) {
        console.error("fail: ", FAILs)
        dispatch(
            setNotification({
                message: "Update note failed",
                status: "error",
                show: true,
            })
        );
    }
}


export default noteActions;
