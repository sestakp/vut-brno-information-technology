const ReducerBase = (state, action, actions) => {
    switch(action.type){
        case actions.CREATE:
            return { ...state, records: [ ...state.records.filter(x=>x.id !== action.payload.id), action.payload], errors: {} }
        case actions.DELETE:
            return { 
                ...state,
                records: [ ...state.records.filter(x => x.id !== action.payload) ]
            }
        case actions.UPDATE:
            var records = state.records;
            var index = records.findIndex((record) => record.id === action.payload.id);
            records[index] = action.payload;

            var selectedRecords = state.selectedRecords;
            index = selectedRecords.findIndex((record) => record.id === action.payload.id);
            selectedRecords[index] = action.payload;

            return { ...state, records: [...records], selectedRecords: [ ...selectedRecords], errors: {}}
        case actions.GET_ALL:
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
        case actions.UPDATE_FIELD:
            var newRecords = state.records
            var item = newRecords.find(m => m.id == action.payload.id)
            var index = newRecords.indexOf(item)
            if(index !== -1){
                if(Array.isArray(newRecords[index][action.payload.fieldName])){
                    if(newRecords[index][action.payload.fieldName].includes(action.payload.value)){
                        newRecords[index][action.payload.fieldName] = newRecords[index][action.payload.fieldName].filter(e => e !== action.payload.value)
                    }
                    else{                        
                        newRecords[index][action.payload.fieldName] = [...newRecords[index][action.payload.fieldName], action.payload.value]
                    }
                }
                else{
                    newRecords[index][action.payload.fieldName] = action.payload.value
                }
            }
            return {...state, records:[...newRecords]}
            
        default:
            return state;
    }
}

export default ReducerBase;