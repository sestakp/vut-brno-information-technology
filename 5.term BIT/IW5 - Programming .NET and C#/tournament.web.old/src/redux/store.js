import rootReducer from './rootReducer';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import pagingEnum from './paging/PagingEnum';

const INITIAL_STATE = { 
    game: {
        records: []
    },
    person: {
        records: []
    },
    team: {
        records: []
    },
    result: {
        records: []
    },
    slot: {
        records: []
    },
    tournamentPlacement:{
        records: []
    },
    loading: false,
    paging: pagingEnum.INDEX,
    record: {},
    
};

export const store = createStore(
    rootReducer,
    INITIAL_STATE,
    composeWithDevTools(applyMiddleware(thunk))
);
