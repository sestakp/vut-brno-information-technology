import FormBase from "./FormBase";
import * as TeamLibrary from "../../utils/renderUtils/teamLibrary";

import {
    selectIsLoading,
    selectById,
    selectIsFetched,
    createAsync,
    getByIdAsync,
    updateAsync,
    getFormDefaultModelAsync,
    selectFormDefaultModel,
    selectFirstSelectedRecord,
    clearSelectedRecords
  } from '../../features/models/team/teamSlice';



function TeamForm(){
    return(
        <FormBase
            recordLibrary={TeamLibrary}
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

export default TeamForm;