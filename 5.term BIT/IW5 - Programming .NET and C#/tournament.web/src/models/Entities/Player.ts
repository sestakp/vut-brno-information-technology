import Model from "../api/Model";

export default interface Player extends Model{
    id: string,
    teamEntityId?: string,
    name?: string,
    surname?: string,
    nickname?: string,
}