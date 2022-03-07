import FormBase from "./FormBase";
import * as TournamentVenueLibrary from "../../utils/renderUtils/tourmaneVenueLibrary";

import {
    selectIsLoading,
    createAsync,
    updateAsync,
    getFormDefaultModelAsync,
    selectFormDefaultModel,
    selectFirstSelectedRecord,
    clearSelectedRecords
  } from '../../features/models/tournamentVenue/tournamentVenueSlice';



function TournamentVenueForm(){
    return(
        <FormBase
            recordLibrary={TournamentVenueLibrary}
            selectIsLoading={selectIsLoading}
            createAsync={createAsync}
            updateAsync={updateAsync}
            getFormDefaultModelAsync={getFormDefaultModelAsync}
            selectFormDefaultModel={selectFormDefaultModel}
            selectFirstSelectedRecord={selectFirstSelectedRecord}
            clearSelectedRecords={clearSelectedRecords}
        />
    )
}

export default TournamentVenueForm;