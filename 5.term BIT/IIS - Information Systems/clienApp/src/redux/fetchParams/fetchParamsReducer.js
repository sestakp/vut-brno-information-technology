/**
 * Author: Lukáš Plevač
 */
import fetchParamsTypes from "./fetchParamsTypes";

const INITIAL_STATE = null;

const fetchParamsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case fetchParamsTypes.SET_FETCH_PARAM:
            return { ...state, [action.field]: action.payload};
        default:
            return state;
    }
};

export default fetchParamsReducer;
