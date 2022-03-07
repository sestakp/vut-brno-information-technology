import TeamTypes from "./teamTypes"
import {dispatch} from 'react-redux';
import teamClient from "../../api/teamClient";
import * as loadingActions from "../loading/loadingActions";

const setMessage = (message) => {
    return(message)
}

export const Create = (payload) => async(dispatch) => {

    console.log("payload: ", payload);

    payload.image = payload.imagePath;
    const response = teamClient.create(payload);
    let data = await Promise.resolve(response);
    const newId = data.data;    
    payload.id = newId;

    console.log("returning = payload: ", payload);
    dispatch(setMessage({
        type: TeamTypes.CREATE,
        payload: payload,
    }));
};

export const Delete = (payload) => ({
    type: TeamTypes.DELETE,
    payload: payload,
});

export const Update = (payload) => async(dispatch) => {
    console.log("payload: ", payload);

    payload.image = payload.imagePath;
    const response = teamClient.update(payload);
    let data = await Promise.resolve(response);
    const newId = data.data;    
    payload.id = newId;

    console.log("returning = payload: ", payload);
    dispatch(setMessage({
        type: TeamTypes.UPDATE,
        payload: payload,
    }));
}

export const Fetch = () => async(dispatch) => {
    try{
        dispatch(loadingActions.setLoading(true));
        const response = await teamClient.getAll();
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
    type: TeamTypes.FETCH,
    payload: payload,  
});
