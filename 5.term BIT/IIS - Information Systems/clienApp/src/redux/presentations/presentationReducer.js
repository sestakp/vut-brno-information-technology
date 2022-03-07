/**
 * Author: Lukáš Plevač
 */
import PresentationTypes from './presentationTypes';
import ReducerBase from '../ReducerBase';

const INITIAL_STATE = {records: []};

const PresentationReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, PresentationTypes);

    switch(action.type){
        default:
            return state;
    }
};

export default PresentationReducer;
