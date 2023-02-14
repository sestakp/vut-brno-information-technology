import React from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { getRoute, getAllRoutes } from './routes';
import GameIndex from '../pages/indexes/GameIndex';
import PersonIndex from '../pages/indexes/PersonIndex';
import ResultIndex from '../pages/indexes/ResultIndex';
import SlotIndex from '../pages/indexes/SlotIndex';
import TeamIndex from '../pages/indexes/TeamIndex';
import TournamentPlacementIndex from '../pages/indexes/TournamentPlacementIndex';
import Home from '../components/Home/Home';

const RouterSwitch = () => {
    return (
        <Switch>
            <Route
                component={GameIndex}
                path={getRoute('Game').path}
                exact={true}
            />
            <Route
                component={PersonIndex}
                path={getRoute('Person').path}
                exact={true}
            />
            <Route
                component={ResultIndex}
                path={getRoute('Result').path}
                exact={true}
            />
            <Route
                component={SlotIndex}
                path={getRoute('Slot').path}
                exact={true}
            />
            <Route
                component={TeamIndex}
                path={getRoute('Team').path}
                exact={true}
            />
            <Route
                component={TournamentPlacementIndex}
                path={getRoute('TournamentPlacement').path}
            />
            
            <Route
                component={Home}
                path={getRoute('Home').path}
            />

            <Redirect to={getRoute('Home').path} />

        </Switch>
    );
};

export default RouterSwitch;
