import ReducerBase from '../base/ReducerBase';
import userTypes from './userTypes';

const INITIAL_STATE = {
    user: {
        name: "",
        email: "",
        tel: "",
        password: "",
        role: "",
        avatar: undefined,
        reservations: []
    },
    reservations: [],
    registration: {
        name: "",
        email: "",
        tel: "",
        password: "",
        passwordAgain: "",
        avatar: undefined
    },
    records: []

};

const userReducer = (state = INITIAL_STATE, action) => {
    state = ReducerBase(state, action, userTypes);

    switch (action.type) {
        case userTypes.SET_REGISTRATION_PARAM:
            return { ...state, registration: {...state.registration, [action.payload.field]: action.payload.value}}

        case userTypes.UPDATE_USER_FIELD:
            return {...state, user: {...state.user, [action.field]: action.payload}}

        case userTypes.REMOVE_USER_RESERVATION:
            return {...state, reservations: [...state.reservations.filter(r => r.id !== action.payload)]}
        
        case userTypes.ADD_NOTE_TO_RESERVATION:
            let reservation = state.reservations?.filter(r => r.id === action.payload.reservationId);
            let newReservations = state.reservations?.filter(r => r.id !== action.payload.reservationId);

            if(reservation.length === 0){
                return state;
            }

            reservation = reservation[0]

            let reservationIndex = state.reservations.indexOf(reservation)
                
            let room = reservation.rooms?.filter(r => r.id === action.payload.roomId);
            
            if (room === undefined){
                return state;
            }

            room[0].notes.push(action.payload.note)
            
            newReservations.splice(reservationIndex, 0, {...reservation});

            return {...state, reservations: newReservations}
            
        case userTypes.USER_RESERVATIONS:
            return {...state, reservations: action.payload}
        case userTypes.ROOM_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default userReducer;
