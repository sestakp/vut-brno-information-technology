import gameTypes from './gameTypes';

const INITIAL_STATE = null;


const gameReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case gameTypes.CREATE_GAME:
            return { ...state, games: [...state.games, action.payload] }
        case gameTypes.DELETE_GAME:
            return { ...state, games: [...state.games.filter(x => x.id !== action.payload.id)] }
        case gameTypes.UPDATE_GAME:
            return { ...state, games: [...state.games.filter(x => x.id !== action.payload.id), action.payload]}
        default:
            return state;
    }
};

export default gameReducer;
