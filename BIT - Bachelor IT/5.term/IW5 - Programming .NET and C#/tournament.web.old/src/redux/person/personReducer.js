import ReducerBase from '../ReducerBase';
import personTypes from "./personTypes";

const INITIAL_STATE = {records: []};

const personReducer = (state = INITIAL_STATE, action) => {
    state = ReducerBase(state, action, personTypes);

    switch(action.type){
        default:
            return state;
    }
};

export default personReducer;
