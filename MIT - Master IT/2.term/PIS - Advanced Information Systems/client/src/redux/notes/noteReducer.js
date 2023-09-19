import noteTypes from "./noteTypes";
import ReducerBase from "../base/ReducerBase";

const INITIAL_STATE = {
    newNote: {
        text: "",
        state: "PENDING"
    },
    records: []
};

const noteReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, noteTypes);
    
    switch(action.type){
        case noteTypes.SET_TEXT_NEW_NOTE:
            return {...state, newNote: {...state.newNote, text: action.payload}}
        case noteTypes.NOTE_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default noteReducer;