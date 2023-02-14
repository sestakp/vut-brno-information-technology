import IndexBase from "./IndexBase";
import slotClient from "../../api/slotClient";
import * as SlotActions from "../../redux/slot/slotActions";
import * as teamSelector from "../../redux/slot/slotSelector";
import entities from "../../libraries/entities";

export default function SlotIndex(){
    return(
        <IndexBase
            header="Slots"
            collection="slot"
            client={slotClient}            
            actions={SlotActions}
            selector={teamSelector}
            entity={entities.SLOT}
        />
    )
}