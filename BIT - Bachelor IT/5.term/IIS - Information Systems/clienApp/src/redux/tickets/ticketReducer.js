/**
 * Author: Pavel Šesták
 */
import ticketTypes from './ticketTypes';
import ReducerBase from '../ReducerBase';

const INITIAL_STATE = {records: []};

const TicketReducer = (state = INITIAL_STATE, action) => {
    
    state = ReducerBase(state, action, ticketTypes);
    switch(action.type){
        case ticketTypes.SET_VISITORS:
            return { ...state, visitors: action.payload}
        case ticketTypes.CREATE:
            return { ...state, visitors: [ ...state.visitors, action.payload] }
        case ticketTypes.UPDATE:
            let visitors = state.visitors;
            const index = visitors.findIndex((visitor) => visitor.id === action.payload.id);
            visitors[index] = action.payload;
            return { ...state, visitors: [...visitors]}
        case ticketTypes.DELETE:
            return { ...state, visitors: [ ...state.visitors.filter(x => x.id !== action.payload.id) ] }
            
        default:
            return state;
    }
};

export default TicketReducer;
