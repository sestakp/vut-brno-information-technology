import { combineReducers } from 'redux';
import gameReducer from './game/gameReducer';
import personReducer from './person/personReducer';
import resultReducer from './result/resultReducer';
import slotReducer from './slot/slotReducer';
import teamReducer from './team/teamReducer';
import tournamentPlacementReducer from './tournamentPlacement/tournamentPlacementReducer';
import loadingReducer from './loading/loadingReducer';
import pagingReducer from './paging/pagingReducer';
import recordReducer from './record/recordReducer';

const mainReducer = combineReducers({
    game: gameReducer,
    person: personReducer,
    result: resultReducer,
    slot: slotReducer,
    team: teamReducer,
    tournamentPlacement: tournamentPlacementReducer,
    loading: loadingReducer,
    record:recordReducer,
    paging: pagingReducer
});

export default mainReducer;
