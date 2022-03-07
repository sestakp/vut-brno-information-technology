/**
 * Author: Lukáš Plevač
 */
import { userTypes } from './userTypes';

const INITIAL_STATE = null;

const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case userTypes.SET_USER:
            return { ...state, user: action.payload};
        case userTypes.SET_USERS:
            return { ...state, users: action.payload};
        case userTypes.DEL_USER:
            return { ...state, users: state.users.filter(x => x.id !== action.payload.id) };
        default:
            return state;
    }
};

export default userReducer;
