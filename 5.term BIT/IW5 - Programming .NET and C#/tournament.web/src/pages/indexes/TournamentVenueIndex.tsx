import IndexBase from "./IndexBase";
import * as TournamentVenueLibrary from "../../utils/renderUtils/tourmaneVenueLibrary";
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
  } from '../../features/models/tournamentVenue/tournamentVenueSlice';

export default function TournamentVenueIndex(){


    return(
        <>
        <IndexBase
            fetchAsync={fetchAsync}
            selectAll={selectAll}
            addSelectedRecord={addSelectedRecord}
            delSelectedRecord={delSelectedRecord}
            cardTableHasImage={false}
            header={"Tournament venues"}
            cardTableSetTitle = {TournamentVenueLibrary.cardTableSetTitle}
            cardTableSetDescription={TournamentVenueLibrary.cardTableSetDescription}
            cardTableSetFooter = {TournamentVenueLibrary.cardTableSetFooter}
            recordLibrary={TournamentVenueLibrary}
            selectIsSelected={selectIsSelected}
            clearSelectedRecords={clearSelectedRecords}
            selectFirstSelectedRecord={selectFirstSelectedRecord}
            detailLink={"TournamentVenue/Detail"}
            updateLink={"TournamentVenue/Update"}
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