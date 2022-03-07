/**
 * Author: Lukáš Plevač
 */
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import TicketActions from "../../../redux/tickets/ticketActions";
import { NavLink } from "react-router-dom";
import ButtonNormal from "../../ButtonNormal/ButtonNormal";
import "./Ticket.css";
function Ticket(props){

    function updateTicket(newStatus){
        let ticket = props.ticket;
        ticket.status = newStatus;
        props.UpdateTicket(ticket);
    }

    return(
        <div className={"p-2"}>
            <NavLink className="row" to={"/conference/detail/"+props.ticket.conference_id}>
                <p>{props.ticket.conference.name} <span className="badge bg-info">{props.ticket.status}</span> </p>   
            </NavLink>
            <ButtonNormal style={{display: props.ticket.status === "reserved" ? "block" : "none"}} onClick={() =>props.DeleteTicket(props.ticket)}>CANCEL RESERVATION</ButtonNormal>
            <ButtonNormal style={{display: (props.ticket.status !== "paid" && props.ticket.status !== "picked up") ? "block" : "none"}} onClick={() => updateTicket("paid")}>PAY TICKET</ButtonNormal>
        </div>
    )
}


const mapStateToProps = (state, ownProps) => ({
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    DeleteTicket: (ticket) => dispatch(TicketActions.Delete(ticket)),
    UpdateTicket: (ticket) => dispatch(TicketActions.Update(ticket)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(Ticket);