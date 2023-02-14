import IndexBase from "./IndexBase";
import * as TeamLibrary from "../../utils/renderUtils/teamLibrary";
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
    selectSelectedRecords,
  } from '../../features/models/team/teamSlice';
  
export default function TeamIndex(){

    return(
        <>
        <IndexBase
            fetchAsync={fetchAsync}
            selectAll={selectAll}
            addSelectedRecord={addSelectedRecord}
            delSelectedRecord={delSelectedRecord}
            cardTableHasImage={true}
            header={"Teams"}
            cardTableSetTitle = {TeamLibrary.cardTableSetTitle}
            cardTableSetDescription={TeamLibrary.cardTableSetDescription}
            cardTableSetFooter = {TeamLibrary.cardTableSetFooter}
            recordLibrary={TeamLibrary}
            selectIsSelected={selectIsSelected}
            clearSelectedRecords={clearSelectedRecords}
            selectFirstSelectedRecord={selectFirstSelectedRecord}
            detailLink={"Team/Detail"}
            updateLink={"Team/Update"}
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