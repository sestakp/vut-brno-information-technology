/*
* Author: Vojtěch Kulíšek
*/
function getBaseSelectors(collection){
    return({
        getAll: (state) => state[collection]?.records,
        getById: (state, id) => state[collection]?.records.filter(x=> Number(x.id) === Number(id))[0],
        getSelectedRecords: (state) => state[collection]?.selectedRecords,
        isLoading: (state) => state[collection]?.loading,
        getFirstSelectedRecord: (state) => state[collection]?.selectedRecords[0],
        isRecordSelected: (state, record) => state[collection]?.selectedRecords.find(x => x.id === record.id) !== undefined,
        getFilter: (state) => state[collection]?.filter,
        getMyRecords: (state) => state[collection]?.records.filter(x => state.user.role === 'admin' || state.user.id === x.used_id),
        getErrors: (state) => state[collection]?.errors,
    })
}

export default getBaseSelectors;