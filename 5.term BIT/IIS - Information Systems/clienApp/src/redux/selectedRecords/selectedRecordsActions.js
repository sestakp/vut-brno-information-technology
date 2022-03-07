/**
 * Author: Vojtěch Kulíšek
 */
import selectedRecordsTypes from './selectedRecordsTypes';

const selectedRecordsActions = ({
    Add: (payload) => {
        return {
            type: selectedRecordsTypes.ADD_SELECTED_RECORD,
            payload: payload
        }
  },
  
   Delete: (payload) =>{
    return {
        type: selectedRecordsTypes.DEL_SELECTED_RECORD,
        payload: payload
    }
  },
  
  Clear: () => {
    return {
        type: selectedRecordsTypes.UNSET_SELECTED_RECORD
    }
  },
  
  })

export default selectedRecordsActions;



