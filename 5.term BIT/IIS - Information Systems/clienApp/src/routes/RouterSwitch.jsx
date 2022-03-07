/*
* Author: Vojtěch Kulíšek
*/
import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import GuardedRoute from '../components/GuardedRoute/GuardedRoute';
import PublicRoute from '../components/PublicRoute/PublicRoute';
import { getRoute } from './routes';
import UserProfile from '../pages/Dashboard/UserProfile/UserProfile';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import ForgotPassword from '../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../pages/ResetPassword/ResetPassword';
import ConferenceIndex from '../pages/Indexes/ConferenceIndex';
import { PresentationIndex } from '../pages/Indexes/PresentationIndex';
import { RoomIndex } from '../pages/Indexes/RoomIndex';
import { TicketIndex } from '../pages/Indexes/TicketIndex';
import ConferenceDetail from '../pages/Details/ConferenceDetail';
import PresentationDetail from '../pages/Details/PresentationDetail';
import RoomDetail from '../pages/Details/RoomDetail';
import ConferenceForm from '../pages/Forms/ConferenceForm';
import PresentationForm from '../pages/Forms/PresentationForm';
import RoomForm from '../pages/Forms/RoomForm';
import ConferenceReservationForm from '../pages/ConferenceReservationForm/ConferenceReservationForm';

const RouterSwitch = () => {
    return (
        <Switch>
            <PublicRoute
                component={ConferenceIndex}
                path={getRoute('home').path}
                exact={true}
            />
            <GuardedRoute
                component={UserProfile}
                path={getRoute('profile').path}
                exact={true}
            />
            <PublicRoute
                component={ConferenceIndex}
                path={getRoute('conference').path}
                exact={true}
            />            
            <PublicRoute
                component={ConferenceDetail}
                path={getRoute('conferenceDetail').path}
                exact={true}
            />            
            <GuardedRoute
                component={ConferenceForm}
                path={getRoute('conferenceUpdate').path}
                exact={true}
            />
            <PublicRoute
                component={ConferenceReservationForm}
                path={getRoute('conferenceReservation').path}
                exact={true}
            />
            <PublicRoute
                component={PresentationIndex}
                path={getRoute('presentation').path}
                exact={true}
            />            
            <PublicRoute
                component={PresentationDetail}
                path={getRoute('presentationDetail').path}
                exact={true}
            />
            <GuardedRoute
                component={PresentationForm}
                path={getRoute('presentationUpdate').path}
                exact={true}
            />
            <PublicRoute
                component={RoomIndex}
                path={getRoute('room').path}
                exact={true}
            />
            <PublicRoute
                component={RoomDetail}
                path={getRoute('roomDetail').path}
                exact={true}
            />
            <GuardedRoute
                component={RoomForm}
                path={getRoute('roomUpdate').path}
                exact={true}
            />
            <PublicRoute
                component={TicketIndex}
                path={getRoute('ticket').path}
                exact={true}
            />
            <PublicRoute
                component={Login}
                path={getRoute('login').path}
                exact={true}
            />
            <PublicRoute
                component={Register}
                path={getRoute('register').path}
                exact={true}
            />
            <PublicRoute
                component={ForgotPassword}
                path={getRoute('forgot-password').path}
                exact={true}
            />
            <PublicRoute
                component={ResetPassword}
                path={getRoute('reset-password').path}
            />
            <Redirect to={getRoute('home').path} />
        </Switch>
    );
};

export default RouterSwitch;
