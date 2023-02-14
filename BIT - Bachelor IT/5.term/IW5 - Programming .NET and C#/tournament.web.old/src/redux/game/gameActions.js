import GameTypes from "./gameTypes";
import gameClient from "../../api/gameClient";
import * as loadingActions from "../loading/loadingActions"

export const Create = (payload) => ({
    type: GameTypes.CREATE,
    payload: payload,
});

export const Delete = (payload) => ({
    type: GameTypes.DELETE,
    payload: payload,
});

export const Update = (payload) => ({
    type: GameTypes.UPDATE,
    payload: payload,
});


export const Fetch = () => async(dispatch) => {
    try{
        dispatch(loadingActions.setLoading(true));
        const response = await gameClient.getAll();
        dispatch(setData(response.data));
        return Promise.resolve(response);
    }
    catch (errors){
        dispatch(setData([]));
        return Promise.reject(errors);
    }
    finally{
        dispatch(loadingActions.setLoading(false));
    }
}

export const setData = (payload) => ({
    type: GameTypes.FETCH,
    payload: payload,  
});

