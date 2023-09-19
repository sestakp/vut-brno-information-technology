import mainReducer from './mainReducer';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

const INITIAL_STATE = { 

};

export const store = createStore(
    mainReducer,
    INITIAL_STATE,
    composeWithDevTools(applyMiddleware(thunk))
);