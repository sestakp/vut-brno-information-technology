import PersonTypes from "./personTypes";
import personClient from "../../api/personClient";
import * as loadingActions from "../loading/loadingActions"

export const Create = (payload) => ({
    type: PersonTypes.CREATE,
    payload: payload,
});

export const Delete = (payload) => ({
    type: PersonTypes.DELETE,
    payload: payload,
});

export const Update = (payload) => ({
    type: PersonTypes.UPDATE,
    payload: payload,
});

export const Fetch = () => async(dispatch) => {
    try{
        dispatch(loadingActions.setLoading(true));
        const response = await personClient.getAll();
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
    type: PersonTypes.FETCH,
    payload: payload,  
});
