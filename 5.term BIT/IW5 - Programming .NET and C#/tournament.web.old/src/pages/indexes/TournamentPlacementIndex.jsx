import IndexBase from "./IndexBase";
import tournamentPlacementClient from "../../api/tournamentPlacementClient";

import * as tournamentPlacementActions from "../../redux/tournamentPlacement/tournamentPlacementActions";
import * as tournamentPlacementSelector from "../../redux/tournamentPlacement/tournamentPlacementSelector";
import entities from "../../libraries/entities";

export default function TournamentPlacementIndex(){
    return(
        <IndexBase
            header="Tournament Placement"
            collection="tournamentPlacement"
            client={tournamentPlacementClient}
            actions={tournamentPlacementActions}
            selector={tournamentPlacementSelector}
            entity={entities.TOURNAMENT_PLACEMENT}
        />
    )
}