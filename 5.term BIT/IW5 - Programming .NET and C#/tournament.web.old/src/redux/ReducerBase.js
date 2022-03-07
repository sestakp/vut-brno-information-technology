
const ReducerBase = (state, action, actions) => {
    console.log("Reducer action: ", action);
    switch(action.type){
        case actions.CREATE:
            return { ...state, records: [ ...state.records, action.payload] }
        case actions.DELETE:
            return { ...state, records: [ ...state.records.filter(x => x.id !== action.payload.id) ] }
        case actions.UPDATE:
            return { ...state, records: [ ...state.records.filter(x => x.id !== action.payload.id), action.payload ] }
        case actions.FETCH:
            return { ...state, records: action.payload }
        default:
            return state;
    }
}

export default ReducerBase;