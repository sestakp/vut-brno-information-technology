/**
 * Author: Lukáš Plevač
 */
import React from 'react';
import { connect} from "react-redux";
import TicketActions from "../../../../redux/tickets/ticketActions";
import Checkbox from '@mui/material/Checkbox';
import "../Card.css";
import { useHistory } from 'react-router';
import userSelector from '../../../../redux/users/userSelector';
import { Button } from '@material-ui/core';
import TicketSelector from '../../../../redux/tickets/ticketSelector';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ButtonNormal from '../../../ButtonNormal/ButtonNormal';
import TextField from '@mui/material/TextField';
import "./ConferenceCard.css";

const ConferenceCard = (props) => {

    const history = useHistory();
    
    let invalidCard = new Date(Date.parse(props.record.finish)) < new Date();

    function updateTicket(newStatus){
        let ticket = props.ticket;
        ticket.status = newStatus;
        props.updateTicket(ticket);
    }
    function handleReservation(e){
        e.preventDefault();
        let form_quantity = e.target[0].value;

        if(props.user.role !== 'guest'){
            props.createTicket({
                conference_id: props.record.id,
                quantity: form_quantity,
                status: 'reserved',
            });
        }
        else{
            //User is not log in, redirect to generate ticket
            history.push("/conference/reservation/" + props.record.id);
        }
    }

    function selectRecord(e){
        /*TODO check if user is admin or creator*/

        if(e.classList.contains("conference-ticket-form") || e.parentElement.classList.contains("conference-ticket-form")){
            return;
        }

        if(props.record.user_id === props.user.id || props.user.role === "admin"){
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

let ticketStatus = "";

if(props.record.user_id === props.user.id){
    ticketStatus = <p>Owner</p>
}
else if(props.record.capacity <= props.record.tickets_count){
    ticketStatus = <p>Sold out</p> 
}
else if(props.ticket === undefined && !invalidCard){
    ticketStatus = <form onSubmit={handleReservation} className="conference-ticket-form">
        <input className="conference-ticket-count" defaultValue={1} type="number" max="8" min="1" required/>
        <ButtonNormal type="submit">Reserve ticket</ButtonNormal>
    </form>
}
else if(props.ticket !== undefined && props.ticket.status === "reserved" && ! invalidCard){
    ticketStatus = <>
    <ButtonNormal onClick={(e) => {e.stopPropagation(); props.deleteTicket(props.ticket)} } style={{marginBottom: "10px"}}>Cancel reservation</ButtonNormal>
    <ButtonNormal onClick={(e) => {e.stopPropagation(); updateTicket("paid")} }>Pay reservation</ButtonNormal>
    </>
}
else if((props.record.capacity > props.record.tickets_count) && props.ticket !== undefined){
    ticketStatus = <p><ConfirmationNumberIcon/>{props?.ticket?.status}</p>
}   

                                                                                                     //Slice to remove one slash in url              
    let imageSrc = (props.record.image === undefined || props.record.image === null) ? "/~xsesta07/IIS/defaultImage.png" : process.env.REACT_APP_API_URL.slice(0, -1) + props.record.image
    return(
        <div className="col-lg-3 col-md-4 col-sm-6" >    
            <div className={"cardWrapper " + (props.checked ? " activeCard " : "")} onClick={e => selectRecord(e.target)}>
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
                        <p>
                            {props.record.description}
                        </p>
                    </div>
                    <div className="row">
                        <p>Author: {props.record.user?.name}</p>
                        
                    </div>

                        <div className="row p-1"> 
                            {ticketStatus}     
                        </div>
                    
                </div>
            </div>
        </div>
    )
}   
const mapStateToProps = (state, ownProps) => ({
    selectedRecords: ownProps.selector.getSelectedRecords(state),
    checked: ownProps.selector.isRecordSelected(state, ownProps.record),
    user: userSelector.getUser(state),
    ticket: TicketSelector.getTicketById(state, userSelector.getUser(state).id, ownProps.record.id),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    add: (model) => dispatch(ownProps.actions.AddToSelected(model)),
    delete: (model) => dispatch(ownProps.actions.DeleteFromSelected(model)),
    clear: () => dispatch(ownProps.actions.ClearSelected()),
    createTicket: (ticket) => dispatch(TicketActions.Create(ticket)),
    deleteTicket: (ticket) => dispatch(TicketActions.Delete(ticket)),
    updateTicket: (ticket) => dispatch(TicketActions.Update(ticket)),
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(ConferenceCard);