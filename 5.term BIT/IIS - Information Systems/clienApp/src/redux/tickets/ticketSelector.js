/**
 * Author: Pavel Šesták
 */
import getBaseSelectors from "../SelectorBase";

let TicketSelector = {
    getAll: (state) => state.ticket.records,
    getTicketById: (state, user_id, conference_id) => state.ticket.records.filter(x=> x.user_id === user_id && x.conference_id === conference_id)[0],
    getTicketsByUser: (state, user_id) => state.ticket.records.filter(x=> x.user_id === user_id),
    getVisitors: (state) => state.ticket.visitors,
}

export default TicketSelector;