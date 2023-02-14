import slotClient from "../../api/slotClient";
import SlotTypes from "./slotTypes"
import * as loadingActions from "../loading/loadingActions"

export const Create = (payload) => ({
    type: SlotTypes.CREATE,
    payload: payload,
});

export const Delete = (payload) => ({
    type: SlotTypes.DELETE,
    payload: payload,
});

export const Update = (payload) => ({
    type: SlotTypes.UPDATE,
    payload: payload,
});

export const Fetch = () => async(dispatch) => {
    try{
        dispatch(loadingActions.setLoading(true));
        const response = await slotClient.getAll();
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
    type: SlotTypes.FETCH,
    payload: payload,  
});
