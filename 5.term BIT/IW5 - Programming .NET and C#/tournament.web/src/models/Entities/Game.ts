import Model from "../api/Model";
import Team from "./Team"
import Player from "./Player"
export default interface Game extends Model{
    id: string,
    teamRed: Team,
    teamBlue: Team,
    start?: string,
    end?: string,
    teamRedPoints?: string,
    teamBluePoints?: string,
    teamRedPlayers?: Player[],
    teamBluePlayers?: Player[],
    TournamentVenueName?: string,
    teamRedName?: string,
    teamBlueName?: string,
}