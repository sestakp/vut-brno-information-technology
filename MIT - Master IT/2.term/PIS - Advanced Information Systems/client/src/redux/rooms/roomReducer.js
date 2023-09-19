
import roomTypes from "./roomTypes";
import ReducerBase from "../base/ReducerBase";

const INITIAL_STATE = {
    roomToAdd:{
        img: null,
        title: "",
        numberOfAdults: 0,
        numberOfChilds: 0,
        description: "",
        price: "",
        services: []
    },
    records: []
};

const RoomsReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, roomTypes);
    
    switch(action.type){
        case roomTypes.SET_NEW_ROOM_FIELD:
            return {...state, roomToAdd: {...state.roomToAdd, [action.payload.field]: action.payload.value}}
        
        case roomTypes.RESET_NEW_ROOM_FIELD:
            return {...state, roomToAdd: {...INITIAL_STATE.roomToAdd}}
        case roomTypes.ADD_ADULT_NEW_ROOM:
            return {...state, roomToAdd: {...state.roomToAdd, numberOfAdults: state.roomToAdd.numberOfAdults + 1}}
        case roomTypes.REMOVE_ADULT_NEW_ROOM:
            return {...state, roomToAdd: {...state.roomToAdd, numberOfAdults: state.roomToAdd.numberOfAdults - 1}}
        case roomTypes.ADD_CHILD_NEW_ROOM:
            return {...state, roomToAdd: {...state.roomToAdd, numberOfChilds: state.roomToAdd.numberOfChilds + 1}}
        case roomTypes.REMOVE_CHILD_NEW_ROOM:
            return {...state, roomToAdd: {...state.roomToAdd, numberOfChilds: state.roomToAdd.numberOfChilds - 1}}       
        case roomTypes.ADD_SERVICE_NEW_ROOM:
            if (state.roomToAdd.services.indexOf(action.payload) === -1) {
                return {...state, roomToAdd: {...state.roomToAdd, services: [...state.roomToAdd.services, action.payload ]}}
            }
        case roomTypes.REMOVE_SERVICE_NEW_ROOM:
            return {...state, roomToAdd: {...state.roomToAdd, services: state.roomToAdd.services.filter(s => s !== action.payload)}}      
        case roomTypes.ROOM_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default RoomsReducer;