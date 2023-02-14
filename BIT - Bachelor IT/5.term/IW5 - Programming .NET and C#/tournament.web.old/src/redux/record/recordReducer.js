import recordTypes from './recordTypes';

const INITIAL_STATE = null;

const recordReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case recordTypes.SET_RECORD:
            return {...action.payload };
        default:
            return state;
    }
};

export default recordReducer;
