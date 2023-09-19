import { Container, Grid, List, ListItem, ListItemText, Paper } from "@mui/material";
import EditableTextField from "../../../components/editableTextField/EditableTextField";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CurrentReservationPaper from "../../../components/currentReservationPaper/CurrentReservationPaper";
import FutureReservationPaper from "../../../components/FutureReservationPaper/FutureReservationPaper";
import PassedReservationPaper from "../../../components/passedReservationPaper/PassedReservationPaper";
import userActions from "../../../redux/users/userActions";
import authorizationSelector from "../../../redux/authorization/authorizationSelector";
import { connect } from "react-redux";
import ReviewForm from "../../../components/reviewForm/ReviewForm";
import userSelector from "../../../redux/users/userSelector";



const UserProfile = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        if(props.currentUser.email === ""){
            navigate("/home")
        }
        
        props.getReservationsByUserId(props.currentUser)
    },[props.currentUser.email])


    let currentDate = new Date()
    currentDate.setHours(0) //maybe timezone offset
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)
    
    let dateList = currentDate.toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }).split(". ")
    let currentDateFormatted = dateList[2]+"-"+("0" + dateList[1]).slice(-2)+"-"+("0" + dateList[0]).slice(-2)
    
    const currentReservations = props.reservations?.filter(r => r.endDate >= currentDateFormatted && r.startDate <= currentDateFormatted)
    
    const futureReservations = props.reservations?.filter(r => r.startDate > currentDateFormatted);
    const pastReservations = props.reservations?.filter(r => r.endDate < currentDateFormatted);

    return(
        <Container>
            <h2>User profile</h2>
            <Paper elevation={5} style={{marginBottom: "25px"}}>
                <Grid container>
                    <Grid item md={4}>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Name"
                                    secondary={
                                        <EditableTextField value={props.currentUser.name} onUpdate={(val) => props.updateUserName(props.currentUser.id, val)}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="E-mail"
                                    secondary={
                                        <EditableTextField value={props.currentUser.email} onUpdate={(val) => props.updateEmail(props.currentUser.id, val)} type="email"/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Telephone"
                                    secondary={
                                        <EditableTextField value={props.currentUser.tel} onUpdate={(val) => props.updateTel(props.currentUser.id, val)} type="tel"/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Password"
                                    secondary={
                                        <EditableTextField value={props.currentUser.password} type="password" onUpdate={(val) => props.updatePassword(props.currentUser.id, val)}/>
                                    }
                                />
                            </ListItem>
                        </List>

                    </Grid>
                    <Grid item md={8}>
                        <h2>My reservations</h2>
                        <hr />

                        {currentReservations.length > 0 &&
                        <>
                            <h2>Current reservations</h2>
                            <div>
                                {currentReservations.map(reservation => <CurrentReservationPaper reservation={reservation}/>)}
                            </div>
                        </>
                        }
                        
                        {futureReservations.length > 0 &&
                        <>
                            <h2>Future reservations</h2>
                            <div>
                                {futureReservations.map(reservation => <FutureReservationPaper reservation={reservation}/>)}
                            </div>
                        </>
                        }     

                        {pastReservations.length > 0 &&
                        <>   
                        <h2>Passed reservations</h2>
                        <div>
                            {pastReservations.map(reservation => <PassedReservationPaper reservation={reservation}/>)}
                        </div>
                        </>
                        }
                    </Grid>
                </Grid>

                <ReviewForm />
            </Paper>
        </Container>
    )
}


const mapStateToProps = (state, ownProps) => ({
    currentUser: authorizationSelector.getUser(state),
    reservations: userSelector.getReservations(state),
    });
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    updateUserName: (id, newValue) => dispatch(userActions.updateUserField(id, "name", newValue)),
    updateEmail: (id, newValue) => dispatch(userActions.updateUserField(id, "email", newValue)),
    updateTel: (id, newValue) => dispatch(userActions.updateUserField(id, "tel", newValue)),
    updatePassword: (id, newValue) => dispatch(userActions.updateUserField(id, "password", newValue)),
    getReservationsByUserId: (user) => dispatch(userActions.getReservationsByUserId(user)),  
});

  
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);