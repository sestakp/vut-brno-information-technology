import IndexBase from "./IndexBase";
import resultClient from "../../api/resultClient";

import * as ResultActions from "../../redux/result/resultActions";
import * as ResultSelector from "../../redux/result/resultSelector";
import entities from "../../libraries/entities";

export default function ResultIndex(){
    return(
        <IndexBase
            header="Results"
            collection="result"
            client={resultClient}      
            actions={ResultActions}
            selector={ResultSelector}
            entity={entities.RESULT}
        />
    )
}