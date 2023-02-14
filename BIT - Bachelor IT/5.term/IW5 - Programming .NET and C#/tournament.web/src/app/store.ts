import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';

import gameReducer from "../features/models/game/gameSlice";
import teamReducer from "../features/models/team/teamSlice";
import playerReducer from "../features/models/player/playerSlice";
import tournamentVenueReducer from "../features/models/tournamentVenue/tournamentVenueSlice"
import notificationReducer from "../features/notification/notificationSlice";
import searchReducer from "../features/search/searchSlice";
export const store = configureStore({
  reducer: {
    game: gameReducer,
    team: teamReducer,
    player: playerReducer,
    tournamentVenue: tournamentVenueReducer,
    notification: notificationReducer,
    search: searchReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
