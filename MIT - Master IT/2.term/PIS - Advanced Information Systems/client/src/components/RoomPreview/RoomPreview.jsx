import React from "react"
import { Button, Grid, Paper, Modal, Box, Tooltip } from "@mui/material"

import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import "./RoomPreview.css"
import Carousel from "react-material-ui-carousel"
import services from "../../utils/services";
import { connect } from "react-redux";
import reservationsSelector from "../../redux/reservations/reservationSelector";
import reservationActions from "../../redux/reservations/reservationActions";
import defaultImage from "../../assets/default-image.jpg"

const RoomPreview = (props) => {

    const [modalOpen, setModalOpen] = React.useState(false)
    
    let servicesList = []

    for (const [key, value] of Object.entries(services)) {
        servicesList.push(
            <Tooltip title={value.name} placement="bottom" key={key}> 
                <div style={{display: "inline-block"}}>
                    <value.icon 
                        style={{color: props.services?.filter(s => s === key).length !== 0 ? "rgb(23, 79, 134)" :"rgb(50,50,50)", fontSize: "15px"}} 
                    />
                </div>
            </Tooltip>
        )
    }

    function changeSelection(isSelected){
        if (isSelected){
            props.removeSelectedRoom()
        }
        else{
            props.addSelectedRoom()
        }
    }


    return(
        <Paper elevation={5} style={{margin: "10px", border: props.isSelected ? "3px solid rgb(23, 79, 134)" : "none" }} onClick={() => setModalOpen(true)}>

            <Grid container>
                <Grid item md={4} style={{display: "flex", alignItems: "center"}}>
                    <img src={props.img === "null" || props.img === null || props.img === undefined ? defaultImage : props.img} style={{maxWidth: "100%"}}/>
                </Grid>
                <Grid item md={6} style={{padding: "10px"}}>
                    <h3>{props.title}
                    {[...Array(props.adultCount)].map((e, i) => <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "15px"}} key={i}/>)}
                    {[...Array(props.childCount)].map((e, i) => <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "10px", marginLeft: "2.5px", marginRight: "2.5px"}} key={i}/>)}    
                    </h3>
                    {servicesList}
                    <p className="roomDescription">{props.description}</p>


                </Grid>
                <Grid item md={2} style={{padding: "10px",display: "flex", justifyContent: "space-around", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", textAlign: "center"}}>
                        <p style={{fontSize: "25px", fontWeight: "bold"}}>$ {props.price}</p>
                        <Button variant="outlined" onClick={(e) => {changeSelection(props.isSelected); e.stopPropagation()}}>{props.isSelected ? "Unselect room" : "Select room"}</Button>
                </Grid>

            </Grid>

            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
                >
                <Box className="modal">
                    <img src={props.img === "null" || props.img === null || props.img === undefined ? defaultImage : props.img} style={{maxWidth: "100%"}}/>

                    
                    <div style={{padding: "25px"}}>
                        <h2 id="parent-modal-title">{props.title}</h2>
                        <p id="parent-modal-description">
                            {props.description}
                        </p>
                        <h3>Services</h3>
                        {servicesList}
                    </div>
                    <Button  variant="outlined" style={{position: "absolute", top: 0, right: 0, backgroundColor: "white"}} onClick={(e) => {setModalOpen(false); e.stopPropagation()}}>X</Button>
                </Box>
            </Modal>
        </Paper>
    )


}


const mapStateToProps = (state, ownProps) => ({
    isSelected: reservationsSelector.isRoomSelected(state, ownProps.id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    addSelectedRoom: () => dispatch(reservationActions.addSelectedRoom(ownProps.id)),
    removeSelectedRoom: () => dispatch(reservationActions.removeSelectedRoom(ownProps.id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomPreview);