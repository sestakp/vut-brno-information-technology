import Model from "../api/Model";
import Player from "./Player";
export default interface Team extends Model{
    id: string,
    country?:string,
    description?: string,
    imagePath?: string,
    name?: string,
    players?: Player[], 
}