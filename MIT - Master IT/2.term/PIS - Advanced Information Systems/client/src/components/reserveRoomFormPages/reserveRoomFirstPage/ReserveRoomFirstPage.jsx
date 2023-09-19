import React, { useEffect } from "react"
import { Grid } from "@mui/material"
import "./reserveRoomFirstPage.css"
import RoomPreview from "../../RoomPreview/RoomPreview";
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';

import room1 from "../../../assets/rooms/room1.jpg"
import room2 from "../../../assets/rooms/room2.jpg"
import room3 from "../../../assets/rooms/room3.jpg"
import room4 from "../../../assets/rooms/room4.jpg"
import services from "../../../utils/services";
import Tooltip from '@mui/material/Tooltip';
import { connect } from "react-redux";
import reservationsSelector from "../../../redux/reservations/reservationSelector";
import reservationActions from "../../../redux/reservations/reservationActions";
import filterRoomsInReservation from "../../../utils/helpers/filterRoomsInReservation";

const ReserveRoomFirstPage = (props) => {

    function isServiceSelected(service){
        return props.reservation.filteredServices.filter(s => s === service).length !== 0
    }
    
    useEffect(() => {
        props.getRooms(props.reservation.startDate, props.reservation.endDate)
        props.getTakenParkingSlots(props.reservation.startDate, props.reservation.endDate);
    },[props.reservation.startDate, props.reservation.endDate])



    function handleSelect(date){
        
        if(date.selection.startDate !== props.reservation.startDate){
            props.setStartDate(date.selection.startDate)
        }

        if(date.selection.endDate !== props.reservation.endDate){
            props.setEndDate(date.selection.endDate)
        }
    }

    let servicesList = []

    for (const [key, value] of Object.entries(services)) {
        servicesList.push(
            <Tooltip title={value.name} placement="bottom" key={key}> 
                <div style={{display: "inline-block"}}>
                    <value.icon 
                        onClick={() => isServiceSelected(value.key) ? 
                                props.removeService(value.key) :
                                props.addService(value.key)
                            } 
                        style={{color: isServiceSelected(value.key) ? "rgb(23, 79, 134)" : "rgb(50,50,50)", fontSize: "30px"}} 
                    />
                </div>
            </Tooltip>
        )
    }



    return(
        <Grid container>
            <Grid item md={4}>
                    <DateRangePicker
                        ranges={[{startDate: props.reservation.startDate, endDate: props.reservation.endDate, key: 'selection'}]}
                        onChange={handleSelect}
                        minDate={new Date()}
                        showSelectionPreview
                    />
                    
                    <div style={{padding: "20px"}}>
                        <h4>Number of guests</h4>
                        <div>
                        {[...Array(props.reservation.numberOfAdults)].map((e, i) => 
                        <Tooltip title={"Remove adult"} placement="left" key={"numberOfAdults"+props.reservation.id+i.toString()}>
                            <div style={{display: "inline-block"}}>
                                <GiPerson onClick={() => props.setNumberOfAdults(props.reservation.numberOfAdults - 1)} style={{color: "rgb(23, 79, 134)", fontSize: "30px"}} key={i}/>
                            </div>
                        </Tooltip>
                        )}
                        <Tooltip title="Add adult" placement="left">
                            <div style={{display: "inline-block"}}>
                                <GiPerson onClick={() => props.setNumberOfAdults(props.reservation.numberOfAdults + 1)} style={{color: "rgb(50,50,50)", fontSize: "30px"}}/>
                            </div>
                        </Tooltip>
                        </div>
                        <div>
                            {[...Array(props.reservation.numberOfChilds)].map((e, i) => 
                            <Tooltip title="Remove child" placement="left" key={"numberOfChilds"+props.reservation.id+i.toString()}>
                                <div style={{display: "inline-block"}}>
                                    <FaChild onClick={() => props.setNumberOfChilds(props.reservation.numberOfChilds - 1)} style={{color: "rgb(23, 79, 134)", fontSize: "20px", marginLeft: "5px", marginRight: "5px"}} key={i}/>
                                </div>
                            </Tooltip>
                            )}
                            <Tooltip title="Add child"  placement="left">
                                <div style={{display: "inline-block"}}>
                                    <FaChild onClick={() => props.setNumberOfChilds(props.reservation.numberOfChilds + 1)} style={{color:"rgb(50,50,50)", fontSize: "20px", marginLeft: "5px", marginRight: "5px"}}/>
                                </div>
                            </Tooltip>
                        </div>
                        <div>
                            
                            <h4>Additional room services</h4>
                            {servicesList}
                        </div>
                        </div> 
                
            </Grid>
            <Grid item md={8}>
                {filterRoomsInReservation(props.reservation.rooms, props.reservation.filteredServices,props.reservation.selectedRooms).map(room => 
                    <RoomPreview id={room.id} adultCount={room.numberOfAdults} childCount={room.numberOfChilds} img={room.img} title={room.title} description={room.description} price={room.price} services={room.services}/>
                )}
            </Grid>
        </Grid>
    )
}


const mapStateToProps = (state, ownProps) => ({
    reservation: reservationsSelector.getReservation(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({

    setStartDate: (date) => dispatch(reservationActions.setStartDate(date)),
    setEndDate: (date) => dispatch(reservationActions.setEndDate(date)),

    setNumberOfAdults: (adults) => dispatch(reservationActions.setNumberOfAdults(adults)),
    setNumberOfChilds: (children) => dispatch(reservationActions.setNumberOfChilds(children)),
    addService: (service) => dispatch(reservationActions.addService(service)),
    removeService: (service) => dispatch(reservationActions.removeService(service)),
    getRooms: (startDate, endDate) => dispatch(reservationActions.getRooms(startDate, endDate)),
    
    getTakenParkingSlots: (startDate, endDate) => dispatch(reservationActions.getTakenParkingSlots(startDate, endDate)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReserveRoomFirstPage);