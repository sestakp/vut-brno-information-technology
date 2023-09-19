import userTypes from './userTypes';
import usersClient from '../../api/userClient';
import { setNotification } from '../notifications/notificationActions';
import getBaseActions from '../base/ActionBase';
import reservationsClient from '../../api/reservationsClient';
import authorizationActions from '../authorization/authorizationActions';


let userActions = getBaseActions(userTypes, usersClient, "users");


userActions.updateUserField = (id, field, value) => async(dispatch) => {
    
    const response = await usersClient.updateField({id, fieldName: field, value})

    if(response.status == 200){
        dispatch(authorizationActions.updateUser(id,field,value))
        dispatch(setNotification({
            message: "User profile updated",
            status: "success",
            show: true,
        }))
    }
    else{
        dispatch(setNotification({
            message: "Server error",
            status: "error",
            show: true,
        }))
    }

}



userActions.setRegistrationParam = (payload) => async(dispatch) =>{
    dispatch({
        type: userTypes.SET_REGISTRATION_PARAM,
        payload: payload
    })
}




userActions.getReservationsByUserId = (user) => async(dispatch) => {
    try{
        const response = await reservationsClient.getReservationsByUserId(user.id);
        if(response.status == 200){
            dispatch({
                type: userTypes.USER_RESERVATIONS,
                field: "reservations",
                payload: response.data
            })
        }
        else{
            dispatch(setNotification({
                message: "Server Error",
                status: "error",
                show: true,
            }))
        }
    }
    catch{
        dispatch(setNotification({
            message: "Connection Error",
            status: "error",
            show: true,
        }))
    }
}

userActions.register = (user) => async (dispatch) => {
    try {
        const response = await usersClient.register(user);
        if(response.data !== -1){
            dispatch(authorizationActions.setCurrentUser(response.data))
            dispatch(authorizationActions.login({name: user.email, password: user.password}))
            dispatch(userActions.setRegistrationParam({field: "name", value: ""}))
            dispatch(userActions.setRegistrationParam({field: "email", value: ""}))
            dispatch(userActions.setRegistrationParam({field: "tel", value: ""}))
            dispatch(userActions.setRegistrationParam({field: "password", value: ""}))
            dispatch(userActions.setRegistrationParam({field: "passwordAgain", value: ""}))
            dispatch(userActions.setRegistrationParam({field: "avatar", value: ""}))
            return true
        }

        dispatch(setNotification({
            message: "Registration Error",
            status: "error",
            show: true,
        }))
        return false


    } catch (errors) {

        dispatch(setNotification({
            message: "Registration Error",
            status: "error",
            show: true,
        }))
        return Promise.resolve(errors);
    }
}



userActions.cancelReservation = (reservationId) => async (dispatch) => {
    try {
        const response = await reservationsClient.delete(reservationId)
        if(response.status === 200){
            
            dispatch({
                type: userTypes.REMOVE_USER_RESERVATION,
                payload: reservationId
            })
            dispatch(setNotification({
                message: "Reservation cancelled",
                status: "success",
                show: true,
            }))
        }
        else{
            dispatch(setNotification({
                message: "Error while canceling reservation",
                status: "error",
                show: true,
            }))
        }
    }
        catch (errors) {
        dispatch(setNotification({
            message: "Error while canceling reservation",
            status: "error",
            show: true,
        }))
        return Promise.resolve(errors);
    }
}

userActions.addNoteToReservation = (note, roomId, reservationId) => async(dispatch) => {
    dispatch({
        type: userTypes.ADD_NOTE_TO_RESERVATION,
        payload: {
            note,
            roomId,
            reservationId
        }
    })
}

export default userActions;
