import getBaseActions from "../base/ActionBase";
import reservationTypes from "./reservationTypes";
import reservationsClient from "../../api/reservationsClient";
import roomsClient from "../../api/roomsClient";
import { setNotification } from "../notifications/notificationActions";

let reservationActions = getBaseActions(reservationTypes, reservationsClient, "rooms");



reservationActions.setStartDate = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "startDate",
            data: data
        }
    });
}

reservationActions.setEndDate = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "endDate",
            data: data
        }
    });
}

reservationActions.setNumberOfAdults = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "numberOfAdults",
            data: data
        }
    });
}

reservationActions.setNumberOfChilds = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "numberOfChilds",
            data: data
        }
    });
}

reservationActions.addService = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "filteredServices",
            data: data,
            type: "add"
        }
    });
}

reservationActions.removeService = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "filteredServices",
            data: data,
            type: "remove"
        }
    });
}

reservationActions.addRoom = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "selectedRooms",
            data: data,
            type: "add"
        }
    });
}

reservationActions.removeRoom = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "selectedRooms",
            data: data,
            type: "remove"
        }
    });
}

reservationActions.getRooms = (startDate, endDate) => async(dispatch) => {
    
    //without this is date offset - 1 day
    let newStart = new Date()
    let newEnd = new Date()

    newStart.setDate(startDate.getDate())
    newEnd.setDate(endDate.getDate())

    let strStartDate = newStart.toISOString().substring(0, 10);
    let strEndDate = newEnd.toISOString().substring(0, 10);
    const response = await roomsClient.getAvailableRooms(strStartDate, strEndDate);

    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "rooms",
            data: response.data
        }
    });
}


reservationActions.setVipParking = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "vipParking",
            data: data,
        }
    });
}

reservationActions.setOutsideParking = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "outsideParking",
            data: data,
        }
    });
}

reservationActions.setInsideParking = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "insideParking",
            data: data,
        }
    });
}

reservationActions.setCookNotes = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "cookNotes",
            data: data,
        }
    });
}

reservationActions.setNormalBreakfast = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "normalBreakfast",
            data: data,
        }
    });
}

reservationActions.setVegetarianBreakfast = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "vegetarianBreakfast",
            data: data,
        }
    });
}

reservationActions.setVeganBreakfast = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "veganBreakfast",
            data: data,
        }
    });
}

reservationActions.addSelectedRoom = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "selectedRooms",
            data: data,
            type: "add"
        }
    });
}

reservationActions.removeSelectedRoom = (data) => async(dispatch) => {
    dispatch({
        type: reservationTypes.SET_VALUE,
        payload: {
            field: "selectedRooms",
            data: data,
            type: "remove"
        }
    });
}


reservationActions.getMealInfo = () => async(dispatch) => {
    const response = await reservationsClient.getMealInfo(); 

    dispatch({
        type: reservationTypes.SET_MEALS,
        payload: response.data
    });
}



reservationActions.sendReservation = (reservation, user) => async(dispatch) => {
    let reservationToSend = JSON.parse(JSON.stringify(reservation));
    reservationToSend.rooms = reservationToSend.selectedRooms;    
    delete reservationToSend.selectedRooms;
    let newStart = new Date()
    let newEnd = new Date()

    newStart.setDate(reservation.startDate.getDate())
    newEnd.setDate(reservation.endDate.getDate())

    let strStartDate = newStart.toISOString().substring(0, 10);
    let strEndDate = newEnd.toISOString().substring(0, 10);
    

    reservationToSend.startDate = strStartDate;
    reservationToSend.endDate = strEndDate;


    reservationToSend.userId = user.id

    reservationToSend.insideParking = Number(reservationToSend.insideParking)
    reservationToSend.outsideParking = Number(reservationToSend.outsideParking)
    reservationToSend.vipParking = Number(reservationToSend.vipParking)

    let response = await reservationsClient.create(reservationToSend)
    if(response.status === 200 && response.data != -1){
        dispatch({
            type: reservationTypes.RESET
        });
        dispatch(setNotification({
            message: "Reservation created",
            status: "success",
            show: true,
        }))

        dispatch(reservationActions.setClientId(undefined));
    }
    else{
        dispatch(setNotification({
            message: "Reservation wasn't created",
            status: "error",
            show: true,
        }))
    }
}


reservationActions.updateNoteForReservations = (id, fieldName, value) => async(dispatch) => {
    dispatch({
        type: reservationTypes.UPDATE_NOTE_FOR_RESERVATIONS,
        payload: {
            fieldName,
            id,
            value,
        },
    });
}


reservationActions.getTakenParkingSlots = (startDate, endDate) => async(dispatch) => {
    //without this is date offset - 1 day
    let newStart = new Date()
    let newEnd = new Date()

    newStart.setDate(startDate.getDate())
    newEnd.setDate(endDate.getDate())

    let strStartDate = newStart.toISOString().substring(0, 10);
    let strEndDate = newEnd.toISOString().substring(0, 10);

    const response = await reservationsClient.getTakenParkingSlots(strStartDate, strEndDate); 
    dispatch({
        type: reservationTypes.SET_TAKEN_PARKING_SLOTS,
        payload: response.data,
    });
}

reservationActions.setClientId = (clientId) => async(dispatch) => {
    
    dispatch({
        type: reservationTypes.SET_CLIENT_ID_FOR_RES,
        payload: clientId,
    })
}

export default reservationActions;
