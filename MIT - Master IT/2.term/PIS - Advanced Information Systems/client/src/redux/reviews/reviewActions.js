import getBaseActions from "../base/ActionBase";
import reviewTypes from "./reviewTypes";
import reviewClient from "../../api/reviewClient";
import { async } from "q";
import { setNotification } from "../notifications/notificationActions";
let reviewActions = getBaseActions(reviewTypes, reviewClient, "review");


reviewActions.sendReview = (review) => async(dispatch) => {
    
    const response = await reviewClient.create(review);
    if(response.status == 200){
        dispatch(setNotification({
            message: "Review send",
            status: "success",
            show: true,
        }))
    }
}

reviewActions.getReviews = () => async(dispatch) => {
    const response = await reviewClient.getAll();

    dispatch({
        type: reviewTypes.SET_REVIEWS,
        payload: response.data
    })
}


reviewActions.getUserReview = (userId) => async(dispatch) => {
    const response = await reviewClient.getByUserId(userId);

    if(response.status == 200){
        dispatch({
            type: reviewTypes.SET_USER_REVIEW,
            payload: response.data
        })
    }
    else{
        dispatch(setNotification({
            message: "Error with downloading user review",
            status: "error",
            show: true,
        }))
    }
}


reviewActions.setUserReviewText = (newText) => async(dispatch) => {
    dispatch({
        type: reviewTypes.SET_FIELD_USER_REVIEW,
        field: "text",
        payload: newText
    })
}

reviewActions.setUserReviewRating = (newRating) => async(dispatch) => {
    dispatch({
        type: reviewTypes.SET_FIELD_USER_REVIEW,
        field: "rating",
        payload: newRating
    })
}
export default reviewActions;
