import React, { useState, useEffect } from "react";
import DetailBase from "./DetailBase";
import * as TeamLibrary from "../../utils/renderUtils/teamLibrary";
import * as teamSlice from "../../features/models/team/teamSlice";

import TeamDetailPlayerList from "../../components/TeamDetailPlayerList/TeamDetailPlayerList"

import { Box, Tab } from "@mui/material";
import { TabPanel, TabList, TabContext } from "@mui/lab";
import * as playerSlice from "../../features/models/player/playerSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Team from "../../models/Entities/Team";
import Loading from "../../components/Loading/Loading";
interface Props {
  match: { params: { id: string } };
}
function TeamDetail(props: Props) {
  const [index, setIndex] = useState("1");
  const id = props.match.params.id;
  const dispatch = useAppDispatch();
  const record:Team = useAppSelector((state) => teamSlice.selectById(state,id));
  const isLoading = useAppSelector(teamSlice.selectIsLoading);

  useEffect(()=> {
      dispatch(teamSlice.getByIdAsync(id));
  },[]);

  if(isLoading){
    return <Loading/>
  }

  return (
    <>
      <DetailBase
        recordLibrary={TeamLibrary}
        record={record}
        clearSelectedRecords={teamSlice.clearSelectedRecords}
      />
      <TabContext value={index}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={(e, newValue) => setIndex(newValue)}
          >
            <Tab label="Players" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <TeamDetailPlayerList
            players={record.players}
          />
        </TabPanel>
        
      </TabContext>
    </>
  );
}

export default TeamDetail;
