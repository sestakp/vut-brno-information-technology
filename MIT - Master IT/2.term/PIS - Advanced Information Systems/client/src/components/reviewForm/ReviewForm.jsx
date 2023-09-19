import { Button, Paper, TextField, Rating } from "@mui/material"
import React, {useEffect, useState} from "react"
import { connect } from "react-redux";
import { setNotification } from "../../redux/notifications/notificationActions";
import reviewActions from "../../redux/reviews/reviewActions";
import reviewSelector from "../../redux/reviews/reviewSelector";
import userSelector from "../../redux/users/userSelector";
import authorizationSelector from "../../redux/authorization/authorizationSelector";

const ReviewForm = (props) => {


    useEffect(() => {
        if(props.currentUser.email !== ""){
            props.getUserReview(props.currentUser.id)
        }
    },[props.currentUser.email])

    function sendReview(){

        let currentDate = new Date()
        currentDate.setHours(0) //maybe timezone offset
        currentDate.setMinutes(0)
        currentDate.setSeconds(0)
        currentDate.setMilliseconds(0)
        
        let dateList = currentDate.toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }).split(". ")
        let currentDateFormatted = dateList[2]+"-"+("0" + dateList[1]).slice(-2)+"-"+("0" + dateList[0]).slice(-2)
        
        const currentReservations = props.reservations?.filter(r => r.endDate >= currentDateFormatted && r.startDate <= currentDateFormatted) ?? []
        const pastReservations = props.reservations?.filter(r => r.endDate < currentDateFormatted) ?? [];
        const alreadyStartedReservations = [...currentReservations, ...pastReservations]

        if(alreadyStartedReservations.length === 0){
            props.setNotification("Without a completed reservation, the user cannot write a review")
            return;
        }

        if(props.userReview.text === null || props.userReview.text === undefined || props.userReview.text === ""){
            props.setNotification("Cannot send review without text")
            return;
        }

        let review = {
            text: props.userReview.text,
            rating: props.userReview.rating,
            userId: props.currentUser.id
        }
        props.sendReview(review)
    }


    return (
        <Paper style={{padding: "25px"}}>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <h2>Write a review</h2>
                <Rating
                    name="simple-controlled"
                    value={props.userReview.rating}
                    onChange={(_, newValue) => {
                        props.setUserReviewRating(newValue);
                    }}
                    />
            </div>
            
            <div>
                <TextField style={{width: "100%"}} multiline rows={7} fullWidth placeholder="Please rate our services..." value={props.userReview.text} onChange={e => props.setUserReviewText(e.target.value)}/>
            </div>
            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "5px"}}>
                <Button variant="outlined" label="submit" onClick={sendReview}>SUBMIT</Button>
            </div>
            
        </Paper>
    )
}

const mapStateToProps = (state, ownProps) => ({
    currentUser: authorizationSelector.getUser(state),
    userReview: reviewSelector.getUserReview(state),
    reservations: userSelector.getReservations(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    sendReview: (review) => dispatch(reviewActions.sendReview(review)),
    getUserReview: (userId) => dispatch(reviewActions.getUserReview(userId)),
    setUserReviewRating: (newRating) => dispatch(reviewActions.setUserReviewRating(newRating)),
    setUserReviewText: (newText) => dispatch(reviewActions.setUserReviewText(newText)),
    
    setNotification: (message) => dispatch(setNotification({ message: message, status: 'error', show: true})),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ReviewForm);