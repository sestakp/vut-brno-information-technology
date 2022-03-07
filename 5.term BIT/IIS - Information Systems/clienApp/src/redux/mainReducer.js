/*
* Author: Pavel Šesták
*/
import { combineReducers } from 'redux';
import notificationReducer from './notifications/notificationReducer';
import userReducer from './users/userReducer';
import ConferenceReducer from './conferences/conferenceReducer';
import PresentationReducer from './presentations/presentationReducer';
import RoomReducer from './rooms/roomReducer';
import TicketReducer from './tickets/ticketReducer';
import loadingReducer from './loading/loadingReducer';
import fetchParamsReducer from './fetchParams/fetchParamsReducer';

const mainReducer = combineReducers({
    user: userReducer,
    notification: notificationReducer,
    conference: ConferenceReducer,
    presentation: PresentationReducer,
    room: RoomReducer,
    ticket: TicketReducer,
    loading: loadingReducer,
    fetchParams: fetchParamsReducer,
});

export default mainReducer;
