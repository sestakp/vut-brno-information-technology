import reservationTypes from "./reservationTypes";
import ReducerBase from "../base/ReducerBase";

const INITIAL_STATE = {
    newReservation: {
        startDate: new Date(),
        endDate: new Date(),
        numberOfAdults: 0,
        numberOfChilds: 0,
        filteredServices: [],
        selectedRooms: [],
        rooms: [],
        vipParking: 0,
        outsideParking: 0,
        insideParking: 0,
        cookNotes: "",
        normalBreakfast: 0,
        vegetarianBreakfast: 0,
        veganBreakfast: 0
    },
    meals: [{},{},{}],
    takenParkingSlots : {
        insideParking: 0,
        outsideParking: 0,
        vipParking: 0,
    },
    records: [],
    clientId: undefined

};

const reservationsReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, reservationTypes);
    
    switch(action.type){
        case reservationTypes.SET_VALUE:
            if(action.payload.type !== undefined){
                if(action.payload.type == "add"){
                    return {...state, newReservation: {...state.newReservation, [action.payload.field]: [...state.newReservation[action.payload.field], action.payload.data]}}
                }
                else{
                    return {...state, newReservation: {...state.newReservation, [action.payload.field]: state.newReservation[action.payload.field].filter(s => s !=  action.payload.data)}}
                }
            }
            
            return {...state, newReservation: {...state.newReservation, [action.payload.field]: action.payload.data}}

        case reservationTypes.RESET:
            return {...INITIAL_STATE}
        case reservationTypes.SET_MEALS:
            return {...state, meals: action.payload}
        case reservationTypes.UPDATE_NOTE_FOR_RESERVATIONS:
            const noteId = action.payload.id;
            var newReservations = state.records;

            for(var i = 0; i < newReservations.length; i++){
                var newReservation = newReservations[i];
                for(var j = 0; j < newReservation.rooms.length; j++){
                    var room = newReservation.rooms[j]
                    for(var k = 0; k < room.notes.length; k++){
                        if(room.notes[k].id == noteId){
                            room.notes[k] = {...room.notes[k], [action.payload.fieldName]: action.payload.value}
                            
                        }
                    }
                    newReservation.rooms[j] = {...room}
                }
            }

            return {...state, records: [...newReservations]}
        case reservationTypes.SET_TAKEN_PARKING_SLOTS:
            return {...state, takenParkingSlots: action.payload }
        case reservationTypes.RES_RESET:
            return INITIAL_STATE;
        case reservationTypes.SET_CLIENT_ID_FOR_RES:
            return {...state, clientId: action.payload}
        default:
            return state;
    }
};

export default reservationsReducer;