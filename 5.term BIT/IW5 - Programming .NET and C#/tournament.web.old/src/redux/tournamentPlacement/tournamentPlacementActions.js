import tournamentPlacementTypes from "./tournamentPlacementTypes"
import tournamentPlacementClient from "../../api/tournamentPlacementClient";
import * as loadingActions from "../loading/loadingActions"

export const Create = (payload) => ({
    type: tournamentPlacementTypes.CREATE,
    payload: payload,
});

export const Delete = (payload) => ({
    type: tournamentPlacementTypes.DELETE,
    payload: payload,
});

export const Update = (payload) => ({
    type: tournamentPlacementTypes.UPDATE,
    payload: payload,
});

export const Fetch = () => async(dispatch) => {
    try{
        dispatch(loadingActions.setLoading(true));
        const response = await tournamentPlacementClient.getAll();
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
    type: tournamentPlacementTypes.FETCH,
    payload: payload,  
});
