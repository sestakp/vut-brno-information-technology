import resultClient from "../../api/resultClient";
import ResultTypes from "./resultTypes";
import * as loadingActions from "../loading/loadingActions"

export const Create = (payload) => ({
    type: ResultTypes.CREATE,
    payload: payload,
});

export const Delete = (payload) => ({
    type: ResultTypes.DELETE,
    payload: payload,
});

export const Update = (payload) => ({
    type: ResultTypes.UPDATE,
    payload: payload,
});

export const Fetch = () => async(dispatch) => {
    try{
        dispatch(loadingActions.setLoading(true));
        const response = await resultClient.getAll();
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
    type: ResultTypes.FETCH,
    payload: payload,  
});