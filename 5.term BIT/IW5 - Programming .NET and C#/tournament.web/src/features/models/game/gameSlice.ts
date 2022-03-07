import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../../app/store';
import { useAppDispatch } from '../../../app/hooks';
import gameClient from '../../../api/gameClient';
import Model from '../../../models/api/Model';
import Constants from "../../../utils/Constants";
import Game from "../../../models/Entities/Game";
import { setNotification } from '../../notification/notificationSlice';

export interface gameState {
  records: Game[];
  selectedRecords: Game[];
  formDefaultModel: Game,
  status: 'idle' | 'loading' | 'failed' | 'notFetched';
}

const initialState: gameState = {
  records: [],
  selectedRecords: [],
  formDefaultModel: { 
    id: Constants.GUID_EMPTY, 
    teamBlue: {
      id:Constants.GUID_EMPTY,
    },
    teamRed:{
      id: Constants.GUID_EMPTY,
    }

  },
  status: 'notFetched',
};

export const fetchAsync = createAsyncThunk(
  'game/fetch',
  async () => {
    try{
      const response = await gameClient.getAll({});
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
    catch(exception){
      return null;
    }
  }
);

export const getByIdAsync = createAsyncThunk(
  'game/getById',
  async (id: string) => {
    try{
      const response = await gameClient.getById(id);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
    catch(exception){
      return null;
    }
  }
);

export const createAsync = createAsyncThunk(
  'game/create',
  async (payload: any) => {
    try{
      payload.image = payload.imagePath;
      const response = await gameClient.create(payload);
      // The value we return becomes the `fulfilled` action payload

      return response.data;
    }
    catch(exception){
      return null;
    }
  }
);

export const getFormDefaultModelAsync = createAsyncThunk(
  'game/getFormDefaultModel',
  async () => {
    try{
      const response = await gameClient.getFormDefaultModel();
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
    catch{
      return null;
    }
  }
)


export const updateAsync = createAsyncThunk(
  'game/update',
  async (payload: any) => {
    try{
      payload.image = payload.imagePath;
      const response = await gameClient.update(payload);
      // The value we return becomes the `fulfilled` action payload
      return response.data;
    }
    catch(exception){
      return null;
    }
  }
);

export const deleteAsync = createAsyncThunk(
  'game/delete',
  async (payload: any) => {
    try{
      await gameClient.delete(payload);
      // The value we return becomes the `fulfilled` action payload
      return payload;
    }
    catch(exception){
      return null;
    }
  }
);

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addSelectedRecord: (state, action: PayloadAction<Game>) => {
      state.selectedRecords.push(action.payload);
    },
    delSelectedRecord: (state, action: PayloadAction<Game>) => {
      state.selectedRecords = state.selectedRecords.filter(x=> x.id !== action.payload.id);
    },
    clearSelectedRecords: (state) => {
      state.selectedRecords = [];
    }
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    //fetch
    builder
      .addCase(fetchAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAsync.fulfilled, (state, action) => {
        
         if(action.payload !== null){
          state.status = 'idle';
          state.records = action.payload;
          

        }
        else{
          state.status = 'failed';
        }
      });

    //getById
    builder
      .addCase(getByIdAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getByIdAsync.fulfilled, (state, action) => {
        if(action.payload !== null){
          state.status = 'idle';
          state.records = state.records.filter(x => x.id !== action.payload.id);
          
          state.records.push(action.payload);
          state.selectedRecords.push(action.payload);
        }
        else{
          state.status = 'failed'
        }
      });

    //formDefaultModel
    builder
    .addCase(getFormDefaultModelAsync.pending, (state) => {
      state.status = 'loading';
    })
    .addCase(getFormDefaultModelAsync.fulfilled, (state, action) => {
      if(action.payload !== null){
        state.status = 'idle';
        state.formDefaultModel = action.payload;
      }
      else{
        state.status = 'failed'
      }
    });

    //create
    builder
      .addCase(createAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createAsync.fulfilled, (state, action) => {
        if(action.payload !== null){
          state.status = 'idle';
          if(isNaN(action.payload?.start[action.payload?.start?.length -1])){
            action.payload.start = 	action.payload.start?.substring(0, action.payload.start?.length - 1);
          }

          if(isNaN(action.payload.end[action.payload.end?.length -1])){
            action.payload.end = 	action.payload.end?.substring(0, action.payload.end?.length - 1);
          }
          state.records.push(action.payload);
        }
        else{
          state.status = 'failed';
          //TODO... add message about fail
        }
      });

      //update
      builder
      .addCase(updateAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateAsync.fulfilled, (state, action) => {
        if(action.payload !== null){

          if(isNaN(action.payload.start[action.payload.start.length -1])){
            action.payload.start = 	action.payload.start.substring(0, action.payload.start.length - 1);
          }

          if(isNaN(action.payload.end[action.payload.end.length -1])){
            action.payload.end = 	action.payload.end.substring(0, action.payload.end.length - 1);
          }

          state.status = 'idle';
          state.records = state.records.filter(x => x.id !== action.payload.id);
          state.selectedRecords = state.selectedRecords.filter(x => x.id !== action.payload.id);
          state.records.push(action.payload);
        }
        else{
          state.status = 'failed';
          //TODO... add message about fail
        }
      });

      //delete
      builder
      .addCase(deleteAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteAsync.fulfilled, (state, action) => {
        if(action.payload !== null){
          state.status = 'idle';
          state.records = state.records.filter(x => x.id !== action.payload.id);
          state.selectedRecords = state.selectedRecords.filter(x => x.id !== action.payload.id);
        }
        else{
          state.status = 'failed';
        }
      });
      
  },
});


export const { addSelectedRecord, delSelectedRecord, clearSelectedRecords } = gameSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectAll = (state: RootState) => state.game.records;
export const selectById = (state: RootState, id: string) => state.game.records.filter(x=> x.id === id)[0] ?? { id: Constants.GUID_EMPTY};
export const selectIsSelected = (state: RootState, record:Model) => state.game.selectedRecords.filter(x => x.id === record.id).length !== 0;
export const selectFormDefaultModel = (state: RootState) => state.game.formDefaultModel;

export const selectFirstSelectedRecord = (state: RootState) => state.game.selectedRecords[0];
export const selectSelectedRecords = (state: RootState) => state.game.selectedRecords;

export const selectIsAnyRecordSelected = (state: RootState) => state.game.selectedRecords.length !== 0;
export const selectIsOneRecordSelected = (state: RootState) =>  state.game.selectedRecords.length === 1;

export const selectIsLoading = (state: RootState) => state.game.status === 'loading';
export const selectIsFetched = (state: RootState) => state.game.status !== 'notFetched';

export default gameSlice.reducer;
