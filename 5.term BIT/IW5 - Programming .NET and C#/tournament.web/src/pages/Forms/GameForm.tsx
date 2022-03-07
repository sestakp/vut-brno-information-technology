import FormBase from "./FormBase";
import * as GameLibrary from "../../utils/renderUtils/gameLibrary";

import {
    selectIsLoading,
    createAsync,
    updateAsync,
    getFormDefaultModelAsync,
    selectFormDefaultModel,
    selectFirstSelectedRecord,
    clearSelectedRecords
  } from '../../features/models/game/gameSlice';



function GameForm(){
    return(
        <FormBase
            recordLibrary={GameLibrary}
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

export default GameForm;