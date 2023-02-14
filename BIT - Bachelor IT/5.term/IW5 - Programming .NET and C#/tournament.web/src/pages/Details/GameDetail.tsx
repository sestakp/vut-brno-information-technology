import React, { useEffect} from "react";
import DetailBase from "./DetailBase";
import * as GameLibrary from "../../utils/renderUtils/gameLibrary";
import * as gameSlice from "../../features/models/game/gameSlice";
import TeamDetailPlayerCard from "../../components/TeamDetailPlayerList/TeamDetailPlayerCard/TeamDetailPlayerCard";

import { Box, Tab } from "@mui/material";
import { TabPanel, TabList, TabContext } from "@mui/lab";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Game from "../../models/Entities/Game";
import Loading from "../../components/Loading/Loading";
interface Props {
  match: { params: { id: string } };
}
function GameDetail(props: Props) {

    const id = props.match.params.id;
    const dispatch = useAppDispatch();
    const record:Game = useAppSelector((state) => gameSlice.selectById(state,id));
    const isLoading = useAppSelector(gameSlice.selectIsLoading);
  
    useEffect(()=> {
        dispatch(gameSlice.getByIdAsync(id));
    },[]);
  
    if(isLoading){
      return <Loading/>
    }

  return (
    <>
      <DetailBase
        record={record}
        recordLibrary={GameLibrary}
        clearSelectedRecords={gameSlice.clearSelectedRecords}
      />
      <div className="row">
        <div className="col-md-6">
          <h3>Team Blue</h3>
          {record.teamBluePlayers?.map(player => <TeamDetailPlayerCard id={player.id} imageSrc={player.imagePath} name={player.nickname}/>)}
      
        </div>
        <div className="col-md-6">
          <h3>Team Red</h3>

          {record.teamRedPlayers?.map(player => <TeamDetailPlayerCard id={player.id} imageSrc={player.imagePath} name={player.nickname}/>)}
        </div>
      </div>
    </>
  );
}

export default GameDetail;
