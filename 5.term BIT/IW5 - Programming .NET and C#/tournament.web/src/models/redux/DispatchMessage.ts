import ActionType from "./ActionType";
import Model from "../api/Model";
export default interface DispatchMessage{
    type: string,
    payload: Model,
}