import React, { useEffect } from "react";
import DetailBase from "./DetailBase";
import * as TourmanePlacementLibrary from "../../utils/renderUtils/tourmaneVenueLibrary";
import * as TournamentVenueSlice from "../../features/models/tournamentVenue/tournamentVenueSlice";

import TeamDetailPlayerList from "../../components/TeamDetailPlayerList/TeamDetailPlayerList"

import { Box, Tab } from "@mui/material";
import { TabPanel, TabList, TabContext } from "@mui/lab";
import TournamentVenue from "../../models/Entities/TournamentVenue";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TournamentVenueTimetable from "../../components/TournamentVenueTimetable/TournamentVenueTimetable";
import Loading from "../../components/Loading/Loading";

interface Props {
  match: { params: { id: string } };
}
function TournamentVenueDetail(props: Props) {

    const id = props.match.params.id;
    const dispatch = useAppDispatch();
    const record:TournamentVenue = useAppSelector((state) => TournamentVenueSlice.selectById(state,id));
    const isLoading = useAppSelector(TournamentVenueSlice.selectIsLoading);
  
    useEffect(()=> {
        dispatch(TournamentVenueSlice.getByIdAsync(id));
    },[]);
  
    if(isLoading){
      return <Loading />
    }

    
  return (
    <>
      <DetailBase
        recordLibrary={TourmanePlacementLibrary}
        record={record}
        clearSelectedRecords={TournamentVenueSlice.clearSelectedRecords}
      />
      <TournamentVenueTimetable games={record.games ?? []} />
    </>
  );
}

export default TournamentVenueDetail;
