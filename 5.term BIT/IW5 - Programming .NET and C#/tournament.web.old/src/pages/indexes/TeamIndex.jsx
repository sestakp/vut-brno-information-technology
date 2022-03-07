import IndexBase from "./IndexBase";
import teamClient from "../../api/teamClient";
import * as TeamActions from "../../redux/team/teamActions";
import * as teamSelector from "../../redux/team/teamSelector";
import entities from "../../libraries/entities";
import * as TeamLibrary from "../../libraries/teamLibrary";
export default function TeamIndex(){
    return(
        <IndexBase
            header="Teams"
            collection="team"
            client={teamClient}
            actions={TeamActions}
            selector={teamSelector}
            entity={entities.TEAM}
            recordLibrary={TeamLibrary}
        />
    )
}