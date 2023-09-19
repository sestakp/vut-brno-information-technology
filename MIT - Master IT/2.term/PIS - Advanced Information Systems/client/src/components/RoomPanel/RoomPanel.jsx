import React from "react"
import { Button, Grid, Paper, Modal, Tooltip } from "@mui/material"

import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import "./RoomPanel.css"
import EditableParagraph from "../ediableParagraph/editableParagraph";
import services from "../../utils/services";
import DeleteIcon from '@mui/icons-material/Delete';
import { connect } from "react-redux";
import roomsAction from "../../redux/rooms/roomActions";
import EditableImage from "../editableImage/EditableImage";
import ImageUpload from 'image-upload-react'

const RoomPanel = (props) => {

    let servicesList = []

    for (const [key, value] of Object.entries(services)) {
        servicesList.push(
            <Tooltip title={value.name} placement="bottom" key={key}> 
                <div style={{display: "inline-block"}}>
                    <value.icon 
                        style={{color: props.services?.filter(s => s === key).length !== 0 ? "rgb(23, 79, 134)" :"rgb(50,50,50)", fontSize: "30px"}} 
                        onClick={() => props.setService(key)}
                    />
                </div>
            </Tooltip>
        )
    }

    return(
        <Paper elevation={5} style={{margin: "10px"}}>

            <Grid container>
                <Grid item md={4} style={{display: "flex", alignItems: "center"}} className={props.img == "null" || props.img == null ? "roomPanelWhite" : "roomPanelBlue"}>
                
                <ImageUpload
                    className="imgUpload"
                    handleImageSelect={(e) => {props.updateImage(URL.createObjectURL(e.target.files[0]))}}
                    imageSrc={props.img == "null" || props.img == null ? null : props.img}
                    setImageSrc={() => props.updateImage(null)}
                    style={{
                        width: "95%",
                        height: "95%",
                        background: 'rgb(23, 79, 134)',
                        margin: "5%"

                    }}
                /> 
                </Grid>
                <Grid item md={6} style={{padding: "10px"}}>
                    <h3><EditableParagraph value={props.title} onApprove={props.updateTitle} /></h3>
                    <div>
                        {[...Array(props.adultCount)].map((e, i) => 
                            <Tooltip title="Remove child"  placement="left" key={"person"+i.toString()}>
                                <div style={{display: "inline-block"}}>
                                    <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "30px"}} key={i} onClick={() => props.removeAdult()}/>
                                </div>
                            </Tooltip>
                            )}
                        <Tooltip title="Add adult" placement="left">
                            <div style={{display: "inline-block"}}>
                                <GiPerson style={{color: "rgb(50,50,50)", fontSize: "30px"}} onClick={() => props.addAdult()}/>
                            </div>
                        </Tooltip>
                    </div>
                    <div>
                        {[...Array(props.childCount)].map((e, i) => 
                        <Tooltip title="Remove child"  placement="left" key={"child"+i.toString()}>
                            <div style={{display: "inline-block"}}>
                                <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "20px", marginLeft: "5px", marginRight: "5px"}} key={i} onClick={() => props.removeChild()}/>
                            </div>
                        </Tooltip>
                        )}    
                        <Tooltip title="Add child"  placement="left">
                            <div style={{display: "inline-block"}}>
                                <FaChild style={{color:"rgb(50,50,50)", fontSize: "20px", marginLeft: "5px", marginRight: "5px"}} onClick={() => props.addChild()}/>
                            </div>
                        </Tooltip>
                    </div>
                    {servicesList}
                    <EditableParagraph rows={8} onApprove={props.updateDescription} className="roomDescription" value={props.description}/>


                </Grid>
                <Grid item md={2} style={{padding: "10px",display: "flex", justifyContent: "space-around", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", textAlign: "center"}}>
                        <EditableParagraph inputAdornment={"$ "} value={props.price} onApprove={props.updatePrice}/>
                        <div>
                            <DeleteIcon onClick={() => props.remove(props.id)}/>
                        </div>
                </Grid>

            </Grid>
        </Paper>
    )


}

const mapStateToProps = (state, ownProps) => ({

  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    remove: (id) => dispatch(roomsAction.Delete(id)),
    updateTitle: (newValue) => dispatch(roomsAction.updateField(ownProps.id, "title", newValue)),
    updatePrice: (newValue) => dispatch(roomsAction.updateField(ownProps.id, "price", newValue)),
    updateImage: (newValue) => dispatch(roomsAction.updateField(ownProps.id, "img", newValue)),
    updateDescription: (newValue) => dispatch(roomsAction.updateField(ownProps.id, "description", newValue)),
    addAdult: () => dispatch(roomsAction.updateField(ownProps.id, "numberOfAdults", ownProps.adultCount + 1)),
    removeAdult: () => dispatch(roomsAction.updateField(ownProps.id, "numberOfAdults", ownProps.adultCount - 1)),
    
    addChild: () => dispatch(roomsAction.updateField(ownProps.id, "numberOfChilds", ownProps.childCount + 1)),
    removeChild: () => dispatch(roomsAction.updateField(ownProps.id, "numberOfChilds", ownProps.childCount - 1)),
    setService: (key) => dispatch(roomsAction.updateField(ownProps.id, "services", key))
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(RoomPanel);