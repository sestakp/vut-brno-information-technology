/**
 * Author: Pavel Šesták
 */
import IndexBase from "./IndexBase";
import TicketActions from "../../redux/tickets/ticketActions";
import * as TicketLibrary from "../../utils/renderLibraries/TicketLibrary";
import TicketSelector from "../../redux/tickets/ticketSelector";
import RecordEditPanel from "../../components/RecordEditPanel/RecordEditPanel";

export function TicketIndex(){
    
    return(
        <>
        <IndexBase 
            header="Tickets"
            collection="ticket"
            actions={TicketActions}
            recordLibrary={TicketLibrary}
            selector={TicketSelector}
            cardTableHasImage={false}
            detailLink={"/ticket/detail"}
            updateLink={"/ticket/update"}
        />
        </>
    )
}