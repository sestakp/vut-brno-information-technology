/**
 * Author: Pavel Šesták
 */
import ticketTypes from "./ticketTypes";
import ticketClient from "../../api/ticketClient";
import { setNotification } from '../notifications/notificationActions';

let TicketActions = {
    Create: (payload) => async(dispatch) => {
        try{
            const response = await ticketClient.create(payload);
            
            dispatch({
                type: ticketTypes.CREATE,
                payload: response.data,
            })
            dispatch(
                setNotification({
                    message: "Ticket created sucessfully",
                    status: 'SUCCESS',
                    show: true,
                })
            );
            return response.data;
        }
        catch(e){
            dispatch(
                setNotification({
                    message: "Ticket create failed",
                    status: 'FAIL',
                    show: true,
                })
            );
        }
    },


    Update: (payload) => async(dispatch) => {
        try{
            const response = await ticketClient.update(payload);
            
            dispatch({
                type: ticketTypes.UPDATE,
                payload: {...payload},
            })
            dispatch(
                setNotification({
                    message: "Ticket update sucessfully",
                    status: 'SUCCESS',
                    show: true,
                })
            );
        }
        catch(e){
            dispatch(
                setNotification({
                    message: "Ticket update failed",
                    status: 'FAIL',
                    show: true,
                })
            );
        }
    }, 

    Delete: (payload) => async(dispatch) =>{
        try{
          const response = await ticketClient.delete({id: payload.id});
          dispatch({
              type: ticketTypes.DELETE,
              payload: payload,
          });
          dispatch(
            setNotification({
                message: "Reservation canceled sucessfully",
                status: 'SUCCESS',
                show: true,
            }));
        } 
        catch(exception){
          setNotification({
            message: "Cancel reservation failed",
            status: 'FAIL',
            show: true,
          });
        }
    },
    Fetch: (fetchParams) => async(dispatch) => {
        try{
          const response = await ticketClient.getAll(fetchParams);
          dispatch({type: ticketTypes.FETCH, payload: response.data});
          return Promise.resolve(response);
        }
        catch (FAILs){
            dispatch({type: ticketTypes.FETCH, payload: []}); 
             setNotification({
              message: "Fetching tickets failed",
              status: 'FAIL',
              show: true,
            });
        }
       },

    GetVisitors: (params) => async(dispatch) => {
        try{
            const response = await ticketClient.getVisitors(params);
            dispatch({type: ticketTypes.SET_VISITORS, payload: response.data})
            return Promise.resolve(response);
        }
        catch (errors){
            dispatch({type: ticketTypes.SET_VISITORS, payload: []}); 
             setNotification({
              message: "Fetching tickets failed",
              status: 'FAIL',
              show: true,
            });
        }
    }
}

export default TicketActions;
