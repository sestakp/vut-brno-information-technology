import getBaseActions from "../base/ActionBase";
import roomTypes from "./roomTypes";
import roomsClient from "../../api/roomsClient";
import { setNotification } from "../notifications/notificationActions";
let roomsAction = getBaseActions(roomTypes, roomsClient, "room");

roomsAction.setFieldForNewRoom = (payload) => async(dispatch) => {

    dispatch({
        type: roomTypes.SET_NEW_ROOM_FIELD,
        payload: payload,
    });
}

roomsAction.addAdultForNewRoom = () => async(dispatch) => {
    dispatch({
        type: roomTypes.ADD_ADULT_NEW_ROOM
    });
}

roomsAction.removeAdultForNewRoom = () => async(dispatch) => {
    dispatch({
        type: roomTypes.REMOVE_ADULT_NEW_ROOM
    });
}

roomsAction.addChildForNewRoom = () => async(dispatch) => {
    dispatch({
        type: roomTypes.ADD_CHILD_NEW_ROOM
    });
}

roomsAction.removeChildForNewRoom = () => async(dispatch) => {
    dispatch({
        type: roomTypes.REMOVE_CHILD_NEW_ROOM
    });
}

roomsAction.addServiceForNewRoom = (payload) => async(dispatch) => {
    dispatch({
        type: roomTypes.ADD_SERVICE_NEW_ROOM,
        payload: payload
    });
}

roomsAction.removeServiceForNewRoom = (payload) => async(dispatch) => {
    dispatch({
        type: roomTypes.REMOVE_SERVICE_NEW_ROOM,
        payload: payload
    });
}

roomsAction.createNewRoom = (newRoom) => async(dispatch) => {

    let response = await roomsClient.create(newRoom)
    if(response.status == 200){
        dispatch({
            type: roomTypes.RESET_NEW_ROOM_FIELD
        });
        dispatch({
            type: roomTypes.CREATE,
            payload: {
                ...newRoom,
                id: response.data
            },
        })    
        dispatch(setNotification({
            message: "Room created",
            status: "success",
            show: true,
        }))
    }
    else{
        dispatch(setNotification({
            message: "Room wasn't created",
            status: "error",
            show: true,
        }))
    }
}





export default roomsAction;