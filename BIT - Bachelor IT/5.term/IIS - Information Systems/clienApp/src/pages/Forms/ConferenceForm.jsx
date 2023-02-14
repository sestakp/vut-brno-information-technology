/**
 * Author: Pavel Šesták
 */
import FormBase from "./FormBase";
import ConferenceActions from "../../redux/conferences/conferenceActions";
import * as ConferenceLibrary from "../../utils/renderLibraries/ConferenceLibrary";
import ConferenceSelector from "../../redux/conferences/conferenceSelector";

function ConferenceForm (){
    return(
        <FormBase 
            recordLibrary={ConferenceLibrary}
            actions={ConferenceActions}
            selector={ConferenceSelector}
        />
    )
}

export default ConferenceForm;