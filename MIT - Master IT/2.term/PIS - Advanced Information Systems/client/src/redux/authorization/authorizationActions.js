import AuthorizationClient from "../../api/authorizationClient";
import employeeTypes from "../employees/employeesTypes";
import noteTypes from "../notes/noteTypes";
import { setNotification } from "../notifications/notificationActions";
import { notificationTypes } from "../notifications/notificationTypes";
import reservationTypes from "../reservations/reservationTypes";
import reviewTypes from "../reviews/reviewTypes";
import roomTypes from "../rooms/roomTypes";
import userTypes from "../users/userTypes";
import authorizationTypes from "./authorizationTypes";

const authorizationActions = {
    login: (credentials) => async (dispatch) => {
        try {
            const response = await AuthorizationClient.login(credentials);
            if(response.data !== ""){

                var url = process.env.REACT_APP_API_URL +'api/authorization/ping';
                window.open(url.replace('http://', 'http://'+credentials.name+':'+credentials.password+'@'));

                dispatch(authorizationActions.setCurrentUser(response.data))
                dispatch(authorizationActions.setLoginParam({field: "name", value: ""}))
                dispatch(authorizationActions.setLoginParam({field: "password", value: ""}))
    
                dispatch(setNotification({
                    message: "User logged in",
                    status: "info",
                    show: true,
                }))
                return true
            }
    
            dispatch(setNotification({
                message: "Unknown user credentials",
                status: "error",
                show: true,
            }))
            return false
    
    
        } catch (errors) {
            return Promise.resolve(errors);
        }
    },

    setCurrentUser: (user) => ({
        type: authorizationTypes.SET_USER,
        payload: user,
    }),
    
    setLoginParam: (payload) => async(dispatch) =>{
        dispatch({
            type: authorizationTypes.SET_LOGIN_PARAM,
            payload: payload
        })
    },

    unsetCurrentUser: () => ({
        type: authorizationTypes.SET_USER,
        payload: {
            id: -1,
            name: "",
            email: "",
            tel: "",
            role: "guest"
        }
    }),
    
    logout: () => async (dispatch) => {

        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", process.env.REACT_APP_API_URL +'api/authorization/logout');
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        document.body.appendChild(iframe);
        iframe.onload = function() {
            iframe.remove();
        }

        dispatch(authorizationActions.unsetCurrentUser());
        dispatch({ type: employeeTypes.EMP_RESET })
        dispatch({ type: noteTypes.NOTE_RESET })
        dispatch({ type: notificationTypes.NOTIFI_RESET })
        dispatch({ type: reservationTypes.RES_RESET })
        dispatch({ type: reviewTypes.REV_RESET })
        dispatch({ type: roomTypes.ROOM_RESET })
        dispatch({ type: userTypes.USER_RESET })

        dispatch(setNotification({
            message: "User logouted",
            status: "info",
            show: true,
        }))
    },

    updateUser: (id, fieldName, value) => async(dispatch) => {
        dispatch({
            type: authorizationTypes.UPDATE_USER,
            payload: {
                id,
                fieldName,
                value
            }
        })
    }
}



export default authorizationActions;