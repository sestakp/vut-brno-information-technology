import { Paper, Grid, Button, Modal, Typography, TextField, Badge } from "@mui/material"
import { Box } from "@mui/system";
import { useState } from "react";
import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import { connect } from "react-redux";
import noteSelector from "../../redux/notes/noteSelector";
import noteActions from "../../redux/notes/noteActions";
import "./currentReservationPaper.css";
import defaultImage from "../../assets/default-image.jpg"
import PaymentIcon from "@mui/icons-material/Payment";
import PaidIcon from '@mui/icons-material/Paid';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    //border: '2px solid #000',
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
  };

const CurrentReservationPaper = (props) => {

    const [open, setOpen] = useState( new Array(props.reservation.rooms?.length).fill(false));

    function switchOpen(position){
        let newOpen = open;
        newOpen[position] = !open[position]
        setOpen({...newOpen});
    }

    return(
        <Paper elevation={5} style={{margin: "10px", padding: "10px" }}>
        <Grid container>
            <Grid item md={6}>
                <h2>From {props.reservation.startDate} to {props.reservation.endDate}</h2>
            </Grid>
            
            <Grid item md={6}>
                <div style={{display: "flex", height: "100%", justifyContent: "flex-end", alignItems: "center"}}>
                {props.reservation.paid &&
                    <PaidIcon color="inherit" />
                }
                { ! props.reservation.paid &&
                    <PaymentIcon color="inherit" />
                }
                </div>
            </Grid>
        </Grid>
        
        {props.reservation.rooms?.map((room, index) => (

            <Paper elevation={5}>
                <Grid container style={{margin: "10px"}}>
                    <Grid item md={4} style={{display: "flex", alignItems: "center"}}>
                        <img src={room.img === "null" || room.img === null || room.img === undefined ? defaultImage  : room.img} style={{maxWidth: "100%"}}/>
                    </Grid>
                    <Grid item md={8} style={{padding: "10px"}}>
                        <h3>{room.title}
                        {[...Array(room.adultCount)].map((e, i) => <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "15px"}} key={i}/>)}
                        {[...Array(room.childCount)].map((e, i) => <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "10px", marginLeft: "2.5px", marginRight: "2.5px"}} key={i}/>)}    
                        
                        </h3>
                        <Grid container>
                            <Grid item md={8}>
                                <p className="roomDescription">{room.description}</p>
                            </Grid>
                            <Grid item md={4}>
                            <div>
                            </div>
                                <Badge badgeContent={room.notes.filter(n => n.state === "SOLVED")?.length} color="success">
                                    <Badge className={room.notes.filter(n => n.state === "SOLVED")?.length !== 0 ? "newNoteBadge" : ""} badgeContent={room.notes.filter(n => n.state === "PENDING")?.length} color="primary">    
                                        <Button variant="outlined" onClick={() => switchOpen(index)}>Write note</Button>
                                    </Badge>
                                </Badge>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Modal
                open={open[index]}
                onClose={() => {switchOpen(index); props.setTextForNewNote("")}}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                    Write a note for a cleaner team
                    </Typography>
                    <TextField style={{width: "100%"}} multiline rows={7} fullWidth placeholder="Here you can tell us any extra requirements..." value={props.newNote.text} onChange={(e) => props.setTextForNewNote(e.target.value)}/>
                    <div style={{display: "flex", justifyContent: "flex-end", marginTop: "5px"}}>
                        <Button disabled={props.newNote.text === null || props.newNote.text === undefined || props.newNote.text === ""} variant="outlined" label="submit" onClick={() => {props.createNewNote(props.newNote, props.reservation.id, room.id); switchOpen(index); props.setTextForNewNote("");}}>SUBMIT</Button>
                    </div>
                </Box>
                </Modal>
            </Paper>
        ))

        }
        
    </Paper>
    )
}


const mapStateToProps = (state, ownProps) => ({
    newNote: noteSelector.getNewNote(state),
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    setTextForNewNote: (newText) => dispatch(noteActions.setTextForNewNote(newText)),
    createNewNote: (newNote, reservationId, roomId) => dispatch(noteActions.createNewNote(newNote, reservationId, roomId))
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(CurrentReservationPaper);