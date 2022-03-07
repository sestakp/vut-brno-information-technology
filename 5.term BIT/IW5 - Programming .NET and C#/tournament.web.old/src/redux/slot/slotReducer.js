import slotTypes from './slotTypes';
import ReducerBase from '../ReducerBase';

const INITIAL_STATE = {records: []};

const slotReducer = (state = INITIAL_STATE, action) => {
    state = ReducerBase(state, action, slotTypes);

    switch(action.type){
        default:
            return state;
    }
};

export default slotReducer;
