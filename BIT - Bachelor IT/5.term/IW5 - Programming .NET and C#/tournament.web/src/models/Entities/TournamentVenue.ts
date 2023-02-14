import Model from "../api/Model";
import Game from "./Game";
export default interface TournamentVenue extends Model{
    id: string,
    description?: string,
    name?: string,
    games?: Game[]
}