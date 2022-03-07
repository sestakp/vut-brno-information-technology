import teamTypes from './teamTypes';
import ReducerBase from '../ReducerBase';

const INITIAL_STATE = { records: [] };

const teamReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, teamTypes);

    switch(action.type){
        default:
            return state;
    }
};

export default teamReducer;
