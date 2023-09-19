import { Paper, Grid, Button } from "@mui/material"
import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import { connect } from "react-redux";
import userActions from "../../redux/users/userActions";
import defaultImage from "../../assets/default-image.jpg"


const FutureReservationPaper = (props) => {

    const [openModal, setOpenModal] = useState(false)


    return(
        <Paper elevation={5} style={{margin: "10px", padding: "10px" }}>
        
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <h2>From {props.reservation.startDate} to {props.reservation.endDate}</h2>
            <Button variant="outlined" color="error" style={{margin: "10px"}} onClick={() => setOpenModal(true)}>Cancel reservation</Button>
        </div>
        {props.reservation.rooms?.map(room => (

            <Paper elevation={5}>
                <Grid container style={{margin: "10px"}}>
                    <Grid item md={4} style={{display: "flex", alignItems: "center"}}>
                        <img src={room.img === "null" || room.img === null || room.img === undefined ? defaultImage : room.img} style={{maxWidth: "100%"}}/>
                    </Grid>
                    <Grid item md={8} style={{padding: "10px"}}>
                        <h3>{room.title}
                        {[...Array(room.adultCount)].map((e, i) => <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "15px"}} key={i}/>)}
                        {[...Array(room.childCount)].map((e, i) => <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "10px", marginLeft: "2.5px", marginRight: "2.5px"}} key={i}/>)}    
                        
                        </h3>
                        <Grid container>
                            <p className="roomDescription">{room.description}</p>

                            
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        ))

        }
        <Dialog
            open={openModal}
            onClose={() => {setOpenModal(false)}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            {"You really wish to cancel your reservation?"}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Rooms reserved by you will be freed up for booking by other users and re-booking may not be possible.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {setOpenModal(false)}} autoFocus>Keep a reservation</Button>
            <Button onClick={() => {props.cancelReservation(props.reservation.id); setOpenModal(false)}} color="error">
                Cancel reservation
            </Button>
            </DialogActions>
        </Dialog>   
    </Paper>
    )
}


const mapStateToProps = (state, ownProps) => ({

});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    cancelReservation: (reservationId) => dispatch(userActions.cancelReservation(reservationId)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(FutureReservationPaper);