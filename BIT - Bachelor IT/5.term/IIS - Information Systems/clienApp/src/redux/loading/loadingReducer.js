/**
 * Author: Lukáš Plevač
 */
import loadingTypes from './loadingTypes';

const INITIAL_STATE = null;

const loadingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case loadingTypes.SET_LOADING:
            return action.payload;
        default:
            return state;
    }
};

export default loadingReducer;
