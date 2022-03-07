/**
 * Author: Vojtěch Kulíšek
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userClient from '../../api/userClient';
import ticketClient from '../../api/ticketClient';
import { setCurrentUser } from '../../redux/users/userActions';
import userSelector from '../../redux/users/userSelector';
import ButtonForm from '../ButtonForm/ButtonForm';
import InputForm from '../InputForm/InputForm';
import { connect } from "react-redux";
import TicketSelector from '../../redux/tickets/ticketSelector';
import TicketActions from "../../redux/tickets/ticketActions";
import Ticket from "./Ticket/Ticket";

function TicketPanel(props){

    useEffect(() => {
        props.fetchTickets({ user_id: props.user?.id, });
    }, [])
    
    return (
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <section>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-6 bg-white-no-important dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 sm:p-6">
                            <div>
                                <h2 className="text-lg font-medium leading-6">
                                    Tickets
                                </h2>
                            </div>
                            {props.tickets.map((ticket) => 
                                <Ticket key={ticket.id} ticket={ticket}/>
                            )

                            }
                        </div>
                    </div>
            </section>
        </div>
    );
}


const mapStateToProps = (state, ownProps) => ({
    tickets: TicketSelector.getTicketsByUser(state, userSelector.getUser(state).id),
    user: userSelector.getUser(state),
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchTickets: (fetchParams) => dispatch(TicketActions.Fetch(fetchParams)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(TicketPanel);