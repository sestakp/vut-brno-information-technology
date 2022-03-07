/**
 * Author: Vojtěch Kulíšek
 */
import selectedRecordsTypes from "./selectedRecordsTypes";

const INITIAL_STATE = null;

const selectedRecordsReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case selectedRecordsTypes.ADD_SELECTED_RECORD:
            return [...state, action.payload];
        case selectedRecordsTypes.DEL_SELECTED_RECORD:
            return state.filter(x => x.id !== action.payload.id);
        case selectedRecordsTypes.UNSET_SELECTED_RECORD:
            return [];
        default:
            return state;
    }
};

export default selectedRecordsReducer;
