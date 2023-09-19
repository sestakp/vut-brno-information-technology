import React from "react"
import { Button, Grid, Paper, TextField, Tooltip, InputAdornment } from "@mui/material"

import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import "./RoomPanel.css"
import services from "../../utils/services";
import { connect } from "react-redux";
import ImageUpload from 'image-upload-react'

import 'image-upload-react/dist/index.css'
import roomsSelector from "../../redux/rooms/roomSelector";
import roomsActions from "../../redux/rooms/roomActions";
import {imageUrlToBase64} from "../../utils/helpers/imageUrlToBase64";

const NewRoomPanel = (props) => {   

    let servicesList = []

    function validate(room){
        
        var numberOfPeople = room.numberOfAdults + room.numberOfChilds

        if(numberOfPeople < 1){
            return "Minimal number of guests in room is one"
        }

        if(room.title === ""){
            return "Title is mandatory for room"
        }

        if(room.price === ""){
            return "Price is mandatory for room"
        }

        if(Number(room.price) < 0){
            return "Price is non negative number"
        }
        return false;
    }

    for (const [key, value] of Object.entries(services)) {
        servicesList.push(
            <Tooltip title={value.name} placement="bottom" key={key}> 
                <div style={{display: "inline-block"}}>
                    <value.icon 
                        style={{color: props.room.services.filter(s => s === value.key) == 0 ? "rgb(50,50,50)" : "rgb(23, 79, 134)", fontSize: "30px"}} 
                        onClick={() => {
                            if(props.room.services.filter(s => s === value.key) == 0){
                                props.addService(value.key)
                            }
                            else{
                                props.removeService(value.key)
                            }
                        }}
                    />
                </div>
            </Tooltip>
        )
    }

    return(
        <Paper elevation={5} style={{margin: "10px"}}>

            <Grid container>
                <Grid item md={4} style={{display: "block", position: "relative"}}>
                        <ImageUpload
                            handleImageSelect={(e) => props.setImg(URL.createObjectURL(e.target.files[0]))}
                            imageSrc={props.room.img}
                            setImageSrc={() => props.setImg(null)}
                            style={{
                                width: "95%",
                                height: "95%",
                                background: 'rgb(23, 79, 134)',
                                margin: "5%",
                                
                            }}
                        />
                    
                </Grid>
                <Grid item md={6} style={{padding: "10px"}}>
                    <h3><TextField value={props.room.title} onChange={(e) => props.setTitle(e.target.value)} label="Title" margin="normal" fullWidth/></h3>
                    <div>
                        {[...Array(props.room.numberOfAdults)].map((e, i) => 
                            <Tooltip title="Remove child"  placement="left" key={i}>
                                <div style={{display: "inline-block"}}>
                                    <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "30px"}} onClick={props.removeAdult}/>
                                </div>
                            </Tooltip>
                            )}
                        <Tooltip title="Add adult" placement="left">
                            <div style={{display: "inline-block"}}>
                                <GiPerson style={{color: "rgb(50,50,50)", fontSize: "30px"}} onClick={props.addAdult}/>
                            </div>
                        </Tooltip>
                    </div>
                    <div>
                        {[...Array(props.room.numberOfChilds)].map((e, i) => 
                        <Tooltip title="Remove child"  placement="left" key={i}>
                            <div style={{display: "inline-block"}}>
                                <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "20px", marginLeft: "5px", marginRight: "5px"}} onClick={props.removeChild}/>
                            </div>
                        </Tooltip>
                        )}    
                        <Tooltip title="Add child"  placement="left">
                            <div style={{display: "inline-block"}}>
                                <FaChild style={{color:"rgb(50,50,50)", fontSize: "20px", marginLeft: "5px", marginRight: "5px"}} onClick={props.addChild}/>
                            </div>
                        </Tooltip>
                    </div>
                    {servicesList}
                    <TextField value={props.room.description} onChange={(e) => props.setDescription(e.target.value)} label="Description" margin="normal" multiline rows={8} fullWidth/>


                </Grid>
                <Grid item md={2} style={{padding: "10px",display: "flex", justifyContent: "space-around", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", textAlign: "center"}}>
                        <TextField 
                            value={props.room.price}
                            onChange={(e) => props.setPrice(e.target.value)}
                            label="Price" 
                            margin="normal" 
                            type="number"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">
                                                $
                                                </InputAdornment>,
                              }}
                        />
                        <Button disabled={validate(props.room)}  variant="outlined" onClick={() => { props.createNewRoom(props.room)}}>Create room</Button>
                </Grid>
                <p style={{color: "red"}}>{validate(props.room)}</p>
            </Grid>
        </Paper>
    )


}
const mapStateToProps = (state, ownProps) => ({
    room: roomsSelector.getRoomToAdd(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    setPrice: (price) => dispatch(roomsActions.setFieldForNewRoom({field: "price", value: price})),
    setTitle: (title) => dispatch(roomsActions.setFieldForNewRoom({field: "title", value: title})),
    setDescription: (description) => dispatch(roomsActions.setFieldForNewRoom({field: "description", value: description})),
    setImg: (img) => dispatch(roomsActions.setFieldForNewRoom({field: "img", value: img})),
    addAdult: () => dispatch(roomsActions.addAdultForNewRoom()),
    removeAdult: () => dispatch(roomsActions.removeAdultForNewRoom()),
    addChild: () => dispatch(roomsActions.addChildForNewRoom()),
    removeChild: () => dispatch(roomsActions.removeChildForNewRoom()),
    addService: (service) => dispatch(roomsActions.addServiceForNewRoom(service)),
    removeService: (service) => dispatch(roomsActions.removeServiceForNewRoom(service)),
    createNewRoom: (room) => dispatch(roomsActions.createNewRoom(room)),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(NewRoomPanel);