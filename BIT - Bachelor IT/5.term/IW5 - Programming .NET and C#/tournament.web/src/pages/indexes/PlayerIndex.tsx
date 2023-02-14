import IndexBase from "./IndexBase";
import playerClient from "../../api/playerClient";
import * as PlayerLibrary from "../../utils/renderUtils/playerLibrary";
import {
    fetchAsync,
    selectAll,
    addSelectedRecord, 
    delSelectedRecord,
    selectIsSelected,
    clearSelectedRecords,
    selectFirstSelectedRecord,
    selectIsAnyRecordSelected,
    selectIsOneRecordSelected,
    selectIsLoading,
    setFilter,
    selectFilter,
    deleteAsync,
    selectSelectedRecords
  } from '../../features/models/player/playerSlice';
export default function TeamIndex(){





    return(
        <>
        <IndexBase
            fetchAsync={fetchAsync}
            selectAll={selectAll}
            addSelectedRecord={addSelectedRecord}
            delSelectedRecord={delSelectedRecord}
            cardTableHasImage={true}
            header={"Players"}
            cardTableSetTitle = {PlayerLibrary.cardTableSetTitle}
            cardTableSetDescription={PlayerLibrary.cardTableSetDescription}
            cardTableSetFooter = {PlayerLibrary.cardTableSetFooter}
            recordLibrary={PlayerLibrary}
            selectIsSelected={selectIsSelected}
            clearSelectedRecords={clearSelectedRecords}
            selectFirstSelectedRecord={selectFirstSelectedRecord}
            detailLink={"Player/Detail"}
            updateLink={"Player/Update"}
            selectIsAnyRecordSelected={selectIsAnyRecordSelected}
            selectIsOneRecordSelected={selectIsOneRecordSelected}
            selectIsLoading={selectIsLoading}
            setFilter={setFilter}
            selectFilter={selectFilter}
            deleteAsync={deleteAsync}
            selectSelectedRecords={selectSelectedRecords}
        />
        </>
    )
}