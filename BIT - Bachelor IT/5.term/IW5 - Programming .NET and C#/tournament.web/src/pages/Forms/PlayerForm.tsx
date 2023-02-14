import FormBase from "./FormBase";
import * as PlayerLibrary from "../../utils/renderUtils/playerLibrary";

import {
    selectIsLoading,
    selectById,
    selectIsFetched,
    createAsync,
    getByIdAsync,
    updateAsync,
    getFormDefaultModelAsync,
    selectFormDefaultModel,
    selectFirstSelectedRecord
  } from '../../features/models/player/playerSlice';
import { clearSelectedRecords } from "../../features/models/game/gameSlice";



function PlayerForm(){
    return(
        <FormBase
            recordLibrary={PlayerLibrary}
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

export default PlayerForm;