function getBaseTypes(collection){
    return({
        CREATE: "CREATE_"+collection,
        DELETE: "DELETE_"+collection,
        UPDATE: "UPDATE_"+collection,
        GET_ALL: "GET_ALL_"+collection,
        SET_LOADING: "SET_LOADING_"+collection,
        ADD_SELECTED_RECORD: "ADD_SELECTED_RECORD_"+collection,
        DEL_SELECTED_RECORD: "DEL_SELECTED_RECORD_"+collection,
        UNSET_SELECTED_RECORD: "UNSET_SELECTED_RECORD_"+collection,
        SET_FILTER: "SET_FILTER_"+collection,
        SET_ERRORS: "SET_ERRORS_"+collection,
        UPDATE_FIELD: "UPDATE_FIELD_"+collection,
    })
}
export default getBaseTypes;