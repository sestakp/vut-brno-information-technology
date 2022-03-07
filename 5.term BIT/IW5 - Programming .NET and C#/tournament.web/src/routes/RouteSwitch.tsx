import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { getRoute, getAllRoutes } from './routes';

//HOME
import Home from '../components/Home/Home';

//Global Search
import GlobalSearch from "../pages/GlobalSearch/GlobalSearch";


//INDEXES
import GameIndex from '../pages/indexes/GameIndex';
import PlayerIndex from '../pages/indexes/PlayerIndex';
import TeamIndex from '../pages/indexes/TeamIndex';
import TournamentVenueIndex from '../pages/indexes/TournamentVenueIndex';


//FORMS
import GameForm from "../pages/Forms/GameForm";
import TeamForm from "../pages/Forms/TeamForm";
import TournamentVenueForm from "../pages/Forms/TournamentVenueForm";
import PlayerForm from "../pages/Forms/PlayerForm";


//DETAILS
import GameDetail from '../pages/Details/GameDetail';
import TeamDetail from '../pages/Details/TeamDetail';
import TournamentVenueDetail from '../pages/Details/TournamentVenueDetail';
import PlayerDetail from '../pages/Details/PlayerDetail';


const RouteSwitch: React.FC = () => {
    return (
        <Switch>
           <Route
                component={GameIndex}
                path={getRoute('Game').path}
                exact={true}
            />
            <Route
                component={GameForm}
                path={getRoute('GameUpdate').path}
                exact={true}
            />
            <Route
                component={GameDetail}
                path={getRoute('GameDetail').path}
                exact={true}
            />
            <Route
                component={PlayerIndex}
                path={getRoute('Player').path}
                exact={true}
            />
            <Route
                component={PlayerForm}
                path={getRoute('PlayerUpdate').path}
                exact={true}
            />
            <Route
                component={PlayerDetail}
                path={getRoute('PlayerDetail').path}
                exact={true}
            />
            <Route
                component={TeamIndex}
                path={getRoute('Team').path}
                exact={true}
            />
            <Route
                component={TeamForm}
                path={getRoute('TeamUpdate').path}
                exact={true}
            />
            <Route
                component={TeamDetail}
                path={getRoute('TeamDetail').path}
                exact={true}
            />
            <Route
                component={TournamentVenueIndex}
                path={getRoute('TournamentVenue').path}
                exact={true}
            />
            <Route
                component={TournamentVenueForm}
                path={getRoute('TournamentVenueUpdate').path}
                exact={true}
            />
            <Route
                component={TournamentVenueDetail}
                path={getRoute('TournamentVenueDetail').path}
                exact={true}
            />
            <Route 
                component={GlobalSearch}
                path={getRoute('Search').path}
                exact={true}
            />
            <Route
                component={GameIndex}
                path={getRoute('Home').path}
            />
            <Redirect to={getRoute('Home').path} />
           
        </Switch>
    );
};

export default RouteSwitch;
