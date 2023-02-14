/**
 * Author: Vojtěch Kulíšek
 */
import ConferenceTypes from './conferenceTypes';
import ReducerBase from '../ReducerBase';

const INITIAL_STATE = {records: []};

const ConferenceReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, ConferenceTypes);
    
    switch(action.type){
        default:
            return state;
    }
};

export default ConferenceReducer;
