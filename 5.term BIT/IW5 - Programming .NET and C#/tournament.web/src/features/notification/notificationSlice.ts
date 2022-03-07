import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import Notification from '../../models/redux/Notification';

export interface notificationState {
    message: Notification
}

const initialState: notificationState = {
    message: { 
        message: "",
        status: "",
        show: false,
    }
};


export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.message = action.payload;
    },
  },
});

export const { setNotification } = notificationSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.notification.value)`
export const getNotificaion = (state: RootState) => state.notification.message;


export default notificationSlice.reducer;
