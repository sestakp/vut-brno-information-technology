import Player from "./Player";
import Team from "./Team";
import TournamentVenue from "./TournamentVenue";

export default interface Search{
    teams: Team[],
    players : Player[],
    tournamentVenues: TournamentVenue[],
}