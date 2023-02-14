/*
* Author: Pavel Šesták
*/
import mainReducer from './mainReducer';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const INITIAL_STATE = { 
    conference: {
        records: [],
        selectedRecords: [],
        loading: false,
        filter: {
            global: "",
            only_valid: true,
        },
        errors: [],
    },
    presentation: {
        records: [],
        selectedRecords: [],
        loading: false,
        filter: {
            global: "",
            only_valid: true,
        },
        errors: [],
    },
    room: {
        records: [],
        selectedRecords: [],
        loading: false,
        filter: {
            global: "",
        },
        errors: [],
    },
    ticket: {
        records: [],
        selectedRecords: [],
        loading: false,
        filter: {
            global: "",
        },
        errors: [],
        visitors: []
    },
    loading: false,
    user: {
        user: {},
        users: [],
    },
    fetchParams:{
        conference_id: 0,
        presentation_id: 0,
        room_id: 0,
    }
    
};

export const store = createStore(
    mainReducer,
    INITIAL_STATE,
    composeWithDevTools(applyMiddleware(thunk))
);
