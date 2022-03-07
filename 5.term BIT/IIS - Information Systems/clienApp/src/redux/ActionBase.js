/*
* Author: Pavel Šesták
*/
import * as loadingActions from "./loading/loadingActions";
import { setNotification } from './notifications/notificationActions';

function getBaseActions(types, client, name = "Record"){
 
  let baseActions = {

    setLoading: (loading) => {
      return{
        type: types.SET_LOADING,
        payload: loading,
      }
    },

    setErrors: (errors) => ({
      type: types.SET_ERRORS,
      payload: errors,
    }),

    GetById: (payload) => async(dispatch) => {
      try{
        dispatch(baseActions.setLoading(true));
        const response = await client.getById(payload);
        dispatch({
          type: types.CREATE,
          payload: response.data,
        });
      }
      catch(exception){
        dispatch(
        setNotification({
          message: "Getting by id " + name+" failed",
          status: 'FAIL',
          show: true,
        })
        )
      }
      finally{
        dispatch(baseActions.setLoading(false));
      }
    },

    Create: (payload) => async(dispatch) => {
      try{
        dispatch(loadingActions.setLoading(true));
        const response = await client.create(payload);
        

        if(response.data.errors === undefined){
          dispatch({
            type: types.CREATE,
            payload: response.data,
          });
          dispatch(
            setNotification({
                message: name+" created sucessfully",
                status: 'SUCCESS',
                show: true,
            })
          );
        }
        else{
          console.error("validation error: ", response.data);
          dispatch(baseActions.setErrors(response.data.errors));
          dispatch(
          setNotification({
            message: "Validation error",
            status: 'FAIL',
            show: true,
          })
          )
        }
        return 
      }
      catch(exception){
        dispatch(
        setNotification({
          message: "Creating " + name+" failed",
          status: 'FAIL',
          show: true,
        })
        )
      }
      finally{
        dispatch(loadingActions.setLoading(false));
      }
  },
  
   Delete: (payload) => async(dispatch) =>{
    try{
      const response = await client.delete({id: payload.id});
      dispatch({
          type: types.DELETE,
          payload: payload,
      });
      dispatch(
        setNotification({
            message: name+" deleted sucessfully",
            status: 'SUCCESS',
            show: true,
        }));
    } 
    catch(exception){
      dispatch(
      setNotification({
        message: "Deleting " + name+" failed",
        status: 'FAIL',
        show: true,
      })
      )
    }
    finally{

    }
  },
  
  Update: (payload) => async(dispatch) => {
    try{
      const response = await client.update(payload);
      
      if(response.data.errors === undefined){
        dispatch({
          type: types.UPDATE,
          payload:  response.data,
      });
      dispatch(
        setNotification({
            message: name+" updated sucessfully",
            status: 'SUCCESS',
            show: true,
        }));
      }
      else{
        dispatch(
          setNotification({
              message: "Validation error",
              status: 'FAIL',
              show: true,
          }));
      }
   
    }
    catch(exception){
      dispatch(
      setNotification({
        message: "Updating " + name+" failed",
        status: 'FAIL',
        show: true,
      })
      )
    }
    finally{

    }

    
  },
  
   Fetch: (fetchParams) => async(dispatch) => {
    try{
      dispatch(loadingActions.setLoading(true));
      const response = await client.getAll(fetchParams);
      //TODO check status to 200
      dispatch({type: types.FETCH, payload: response.data});
    }
    catch (FAILs){
        dispatch({type: types.FETCH, payload: []}); 
        dispatch(
        setNotification({
          message: "Fetching " + name+" failed",
          status: 'FAIL',
          show: true,
        })
        )
    }
    finally{
        dispatch(loadingActions.setLoading(false));
    }
   },
   
   AddToSelected: (payload) => ({
      type: types.ADD_SELECTED_RECORD,
      payload: payload
    }),

    DeleteFromSelected: (payload) =>({
      type: types.DEL_SELECTED_RECORD,
      payload: payload
    }),

    ClearSelected: () => ({
      type: types.UNSET_SELECTED_RECORD
    }),

    SetFilter: (field, value) => {
     return{
      type: types.SET_FILTER,
      payload: { field: field, value: value }
     }
    },

  }

  return baseActions;
}

export default getBaseActions;
