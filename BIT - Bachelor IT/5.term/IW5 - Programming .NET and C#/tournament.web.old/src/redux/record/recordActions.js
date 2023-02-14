import recordTypes from './recordTypes';

export const setRecord = (record) => {
    return {
        type: recordTypes.SET_RECORD,
        payload: record
    }
}

