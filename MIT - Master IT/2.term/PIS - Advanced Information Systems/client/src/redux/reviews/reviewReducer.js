import reviewTypes from "./reviewTypes";
import ReducerBase from "../base/ReducerBase";

const INITIAL_STATE = {
   reviews : [ ],

   userReview: {
        text: "",
        rating: 0
   }
};

const reviewReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, reviewTypes);
    
    switch(action.type){

        case reviewTypes.SET_REVIEWS:
            return {...state, reviews: [...action.payload]}
        case reviewTypes.SET_USER_REVIEW:
            return {...state, userReview: action.payload}

        case reviewTypes.SET_FIELD_USER_REVIEW:
            return {...state, userReview: {...state.userReview, [action.field]: action.payload}}
        case reviewTypes.REV_RESET:
            return INITIAL_STATE;
        default:
            return state;
    }
};

export default reviewReducer;