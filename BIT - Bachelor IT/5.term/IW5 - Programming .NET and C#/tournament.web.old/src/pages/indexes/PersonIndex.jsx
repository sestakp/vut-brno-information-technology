import IndexBase from "./IndexBase";
import personClient from "../../api/personClient";
import * as PersonActions from "../../redux/person/personActions";
import * as PersonSelector from "../../redux/person/personSelector";
import entities from "../../libraries/entities";
import * as personLibrary from "../../libraries/personLibrary";

export default function PersonIndex(){
    return(
        <IndexBase
            header="Persons"
            collection="person"
            client={personClient}
            actions={PersonActions}
            selector={PersonSelector}
            entity={entities.PERSON}
            recordLibrary={personLibrary}

        />
    )
}