import resultTypes from './resultTypes';
import ReducerBase from '../ReducerBase';


const INITIAL_STATE = {records: []};

const resultReducer = (state = INITIAL_STATE, action) => {
    state = ReducerBase(state, action, resultTypes);

    switch(action.type){
        default:
            return state;
    }
};

export default resultReducer;
