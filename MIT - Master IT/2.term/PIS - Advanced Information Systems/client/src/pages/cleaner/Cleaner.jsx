import { Paper } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect } from "react";
import { connect } from "react-redux";
import noteActions from "../../redux/notes/noteActions";
import noteSelector from "../../redux/notes/noteSelector";
import reservationActions from "../../redux/reservations/reservationActions";
import reservationsSelector from "../../redux/reservations/reservationSelector";
import CleanerNotePaper from "../../components/cleanerNotePaper/CleanerNotePaper";
import authorizationSelector from "../../redux/authorization/authorizationSelector";

import { useNavigate } from "react-router-dom";


const Cleaner = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        props.getReservations();
    },[])

    useEffect(() => {
        if(props.currentUser.email === ""){
            navigate("/home")
        }
    },[props.currentUser])

    let currentDate = new Date()
    currentDate.setHours(0) //maybe timezone offset
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)
    
    let dateList = currentDate.toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }).split(". ")
    let currentDateFormatted = dateList[2]+"-"+("0" + dateList[1]).slice(-2)+"-"+("0" + dateList[0]).slice(-2)
    
    var currentReservations = [...props.reservations?.filter(r => r.endDate >= currentDateFormatted && r.startDate <= currentDateFormatted)] ?? []
    
    return(
        <Container>
            <Paper>
                <h1>Cleaner module</h1>
                {currentReservations.map(reservation => 
                {
                    return reservation.rooms?.map(room => <CleanerNotePaper room={room}/>)
                }
                )
                }
            </Paper>
        </Container>
    )
}

const mapStateToProps = (state, ownProps) => ({

    reservations: reservationsSelector.getAll(state),  
    currentUser: authorizationSelector.getUser(state),
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    getReservations: () => dispatch(reservationActions.GetAll())
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Cleaner);