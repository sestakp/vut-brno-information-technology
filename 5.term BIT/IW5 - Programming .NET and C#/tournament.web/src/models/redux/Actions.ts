import Model from "../api/Model";

export default interface Actions<TModel>{
    Create: (payload: TModel) => void,
    Delete: (payload: Model) => void,
    Update: (payload: TModel) => void,
    Fetch: (fetchParams: object) => void,
}