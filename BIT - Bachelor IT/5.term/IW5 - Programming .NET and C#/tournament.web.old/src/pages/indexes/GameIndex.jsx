import IndexBase from "./IndexBase";
import gameClient from "../../api/gameClient";

import * as GameActions from "../../redux/game/gameActions";
import * as GameSelector from "../../redux/game/gameSelector";
import entities from "../../libraries/entities";

export default function GameIndex(){
    return(
        <IndexBase
            header="Games"
            collection="game"
            client={gameClient}
            actions={GameActions}
            selector={GameSelector}
            entity={entities.GAME}
        />
    )
}