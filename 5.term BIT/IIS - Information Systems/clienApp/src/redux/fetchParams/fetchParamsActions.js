/**
 * Author: Lukáš Plevač
 */
import fetchParamsTypes from "./fetchParamsTypes";

const fetchParamsActions = {

    setFetchParam: (field, value) => ({
        type: fetchParamsTypes.SET_FETCH_PARAM,
        field: field,
        payload: value,
    }),
}
export default fetchParamsActions;