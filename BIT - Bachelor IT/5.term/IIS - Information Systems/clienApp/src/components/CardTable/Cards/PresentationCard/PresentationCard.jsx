/**
 * Author: Pavel Šesták
 */
import React, { useState } from 'react';
import { connect} from "react-redux";
import selectedRecordsActions from '../../../../redux/selectedRecords/selectedRecordsActions';
import Checkbox from '@mui/material/Checkbox';
import "../Card.css";
import { useHistory } from 'react-router';
import userSelector from '../../../../redux/users/userSelector';
import WarningIcon from '@mui/icons-material/Warning';
import "./PresentationCard.css";
import { Button } from '@material-ui/core';
import ConferenceSelector from '../../../../redux/conferences/conferenceSelector';
import fetchParamSelector from '../../../../redux/fetchParams/fetchParamsSelector';

const PresentationCard = (props) => {
    const history = useHistory();

    
    function updateState(e, val){
        e.stopPropagation();

        let record = props.record;
        record.state = val;
        props.update(record);
    }

    function onClick(){

        /*TODO check if user is admin or creator*/
        if(props.record.user_id === props.user.id || props.user.role === "admin" || props.user.id === props.conference.user_id){
            if(props.checked){
                props.delete(props.record);
            }
            else{
                props.add(props.record);
            }
        }
        else{
            props.clear();
            props.add(props.record);
            history.push(props.detailLink+"/"+props.record.id);
        }
    }


                                                                                                              //Slice to remove one slash in url              
    let imageSrc = (props.record.image === undefined || props.record.image === null) ? "/~xsesta07/IIS/defaultImage.png" : process.env.REACT_APP_API_URL.slice(0, -1) + props.record.image
    return(
        <div className="col-lg-3 col-md-4 col-sm-6">
            <div className={"cardWrapper " + (props.checked ? "activeCard" : "")} onClick={onClick}>    
                {props.record.state !== "approved" &&
                    <WarningIcon 
                        className="p-1" 
                        style={{position: "absolute", zIndex: 999, color: "yellow", fontSize: "40px"}} 
                        data-toggle="tooltip" 
                        data-placement="top" 
                        title="Tooltip on top"
                    />
                }

                <div className={(props.record.state !== "approved") ? " cardFilter " : ""}>
                    <div style={{position: "relative"}}>
                        <img className="card-img-top mh-5" src={imageSrc} alt={props.title+" image"}/>
                    </div>
                    
                    <div className="card-body" style={{wordBreak: "break-word"}}>
                        <div className="row border-bottom">
                            <p style={{padding: 0, margin: 0, verticalAlign: "middle", lineHeight: "40px"}}>
                                <strong>{props.record.name}</strong>
                            </p>
                        </div>
                        <div className="row border-bottom">
                            <p>{props.record.description}</p>
                        </div>
                        <div className="row">
                            <p><span className="badge bg-info">{props.record.state}</span></p>
                            <p>Author: {props.record.user?.name}</p>
                        </div>
                    </div>
                </div>
                {props.presentationApproving &&
                <div className="row">
                    <>
                    <Button variant="outlined" color="primary" onClick={(e) => updateState(e,"approved")} disabled={props.record.state === "approved"}>Approve</Button>
                    <Button variant="outlined" color="secondary" onClick={(e) => updateState(e,"declined")} disabled={props.record.state === "declined"}>Decline</Button>
                    </>                 
                </div>
                }
            </div>
        </div>
    )
}   
const mapStateToProps = (state, ownProps) => ({
    selectedRecords: ownProps.selector.getSelectedRecords(state),
    checked: ownProps.selector.isRecordSelected(state, ownProps.record),
    user: userSelector.getUser(state),
    conference: ConferenceSelector.getById(state, fetchParamSelector.getParam(state,"conference_id")),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    add: (model) => {
        dispatch(ownProps.actions.AddToSelected(model));
    },
    delete: (model) => {
        dispatch(ownProps.actions.DeleteFromSelected(model));
    },
    update: (model) => {
        dispatch(ownProps.actions.Update(model));
    },
    clear: () => {
        dispatch(ownProps.actions.ClearSelected());
    },
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(PresentationCard);