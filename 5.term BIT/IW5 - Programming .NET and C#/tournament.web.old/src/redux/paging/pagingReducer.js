import pagingTypes from './pagingTypes';

const INITIAL_STATE = null;

const pagingReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case pagingTypes.SET_PAGE:
            return action.payload;
        default:
            return state;
    }
};

export default pagingReducer;
