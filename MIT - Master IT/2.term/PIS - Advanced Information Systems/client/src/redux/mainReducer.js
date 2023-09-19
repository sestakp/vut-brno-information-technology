import { combineReducers } from 'redux';
import notificationReducer from './notifications/notificationReducer';
import RoomsReducer from './rooms/roomReducer';
import userReducer from './users/userReducer';
import reviewReducer from './reviews/reviewReducer';
import reservationsReducer from './reservations/reservationReducer';
import employeeReducer from './employees/employeesReducer';
import noteReducer from './notes/noteReducer';
import authorizationReducer from './authorization/authorizationReducer';

const mainReducer = combineReducers({
    notification: notificationReducer,
    rooms: RoomsReducer,
    users: userReducer,
    reviews: reviewReducer,
    reservations: reservationsReducer,
    notes: noteReducer,
    employees: employeeReducer,
    authorization: authorizationReducer
});

export default mainReducer;