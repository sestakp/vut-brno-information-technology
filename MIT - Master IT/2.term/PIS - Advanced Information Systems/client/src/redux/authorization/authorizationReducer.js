import employeeTypes from "../employees/employeesTypes";
import authorizationTypes from "./authorizationTypes";

const INITIAL_STATE = {
    
    login: {
        name: "",
        password: "",
    },
    user: {
        name: "",
        email: "",
        tel: "",
        password: "",
        role: "",
        avatar: undefined,
        reservations: []
    }
};


const authorizationReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case authorizationTypes.SET_USER:
            return { ...state, user: action.payload };
        case authorizationTypes.SET_LOGIN_PARAM:
            return { ...state, login: {...state.login, [action.payload.field]: action.payload.value}}
        case authorizationTypes.UPDATE_USER:

            if(state.user.id === action.payload.id){              
            
                return {...state, user:{...state.user, [action.payload.fieldName]: action.payload.value}}
            }
            return state;
        case authorizationTypes.AUTH_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default authorizationReducer;