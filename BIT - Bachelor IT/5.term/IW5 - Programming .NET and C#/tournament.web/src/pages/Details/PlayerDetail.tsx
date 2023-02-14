import React, { useEffect } from "react";
import DetailBase from "./DetailBase";
import * as PlayerLibrary from "../../utils/renderUtils/playerLibrary";
import * as playerSlice from "../../features/models/player/playerSlice";

import TeamDetailPlayerList from "../../components/TeamDetailPlayerList/TeamDetailPlayerList"

import { Box, Tab } from "@mui/material";
import { TabPanel, TabList, TabContext } from "@mui/lab";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Player from "../../models/Entities/Player";
import Loading from "../../components/Loading/Loading";

interface Props {
  match: { params: { id: string } };
}
function PlayerDetail(props: Props) {

    const id = props.match.params.id;
    const dispatch = useAppDispatch();
    const record:Player = useAppSelector((state) => playerSlice.selectById(state,id));
    const isLoading = useAppSelector(playerSlice.selectIsLoading);
  
    useEffect(()=> {
        dispatch(playerSlice.getByIdAsync(id));
    },[]);
  
    if(isLoading){
      return <Loading/>
    }
  
  return (
    <>
      <DetailBase
        recordLibrary={PlayerLibrary}
        record={record}
        clearSelectedRecords={playerSlice.clearSelectedRecords}
      />
      
    </>
  );
}

export default PlayerDetail;
