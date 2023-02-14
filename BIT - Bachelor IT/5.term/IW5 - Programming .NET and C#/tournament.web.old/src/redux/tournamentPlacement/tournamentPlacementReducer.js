import tournamentPlacementTypes from './tournamentPlacementTypes';
import ReducerBase from '../ReducerBase';

const INITIAL_STATE = {records: []};

const tournamentPlacementReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, tournamentPlacementTypes);

    switch(action.type){
        default:
            return state;
    }
};

export default tournamentPlacementReducer;
