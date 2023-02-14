/*
* Author: Pavel Šesták
*/
const ReducerBase = (state, action, actions) => {
    switch(action.type){
        case actions.CREATE:
            return { ...state, records: [ ...state.records.filter(x=>x.id !== action.payload.id), action.payload], errors: {} }
        case actions.DELETE:
            return { 
                ...state,
                records: [ ...state.records.filter(x => x.id !== action.payload.id) ], 
                selectedRecords: [ ...state.selectedRecords.filter(x => x.id !== action.payload.id) ] 
            }
        case actions.UPDATE:
            let records = state.records;
            let index = records.findIndex((record) => record.id === action.payload.id);
            records[index] = action.payload;

            let selectedRecords = state.selectedRecords;
            index = selectedRecords.findIndex((record) => record.id === action.payload.id);
            selectedRecords[index] = action.payload;

            return { ...state, records: [...records], selectedRecords: [ ...selectedRecords], errors: {}}
        case actions.FETCH:
            return { ...state, records: action.payload }
        case actions.ADD_SELECTED_RECORD:
            return {...state, selectedRecords: [...state.selectedRecords, action.payload]};
        case actions.DEL_SELECTED_RECORD:
            return {...state, selectedRecords: state.selectedRecords.filter(x => x.id !== action.payload.id)};
        case actions.UNSET_SELECTED_RECORD:
            return {...state, selectedRecords: []};
        case actions.SET_FILTER:
            return { ...state, filter: {...state.filter, [action.payload.field]: action.payload.value} }
        case actions.SET_LOADING:
            return { ...state, loading: action.payload}
        case actions.SET_ERRORS:
            return { ...state, errors: action.payload }
        default:
            return state;
    }
}

export default ReducerBase;