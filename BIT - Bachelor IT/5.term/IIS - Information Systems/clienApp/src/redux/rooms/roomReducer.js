/**
 * Author: Vojtěch Kulíšek
 */
import roomTypes from './roomTypes';
import ReducerBase from '../ReducerBase';

const INITIAL_STATE = {records: []};

const RoomReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, roomTypes);

    switch(action.type){
        default:
            return state;
    }
};

export default RoomReducer;
