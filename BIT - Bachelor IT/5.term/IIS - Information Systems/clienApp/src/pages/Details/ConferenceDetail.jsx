/**
 * Author: Lukáš Plevač
 */
import react, { useState, useEffect } from "react";
import DetailBase from "./DetailBase";
import { PresentationIndex } from "../Indexes/PresentationIndex";
import { RoomIndex } from "../Indexes/RoomIndex";
import ConferenceActions from "../../redux/conferences/conferenceActions";
import ConferenceSelector from "../../redux/conferences/conferenceSelector";
import * as ConferenceLibrary from "../../utils/renderLibraries/ConferenceLibrary";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import LayoutWrapper from "../../layouts/LayoutWrapper/LayoutWrapper";
import userSelector from "../../redux/users/userSelector";
import Checkbox from '@mui/material/Checkbox';
import VisitorsPanel from "../../components/VisitorsPanel/VisitorsPanel";
import Loading from "../../components/Loading/Loading";
import fetchParamsActions from "../../redux/fetchParams/fetchParamsActions";

const ConferenceDetail = (props) => {
  const history = useHistory();
  const [index, setIndex] = useState("1");
  const [loading, setLoading] = useState(false);
  const [presentationApproving, setPresentationApproving] = useState(false);

  useEffect(()=> {
      setLoading(true)
      props.fetch().then(_ => setLoading(false));
      props.fetchParamsActions("conference_id", parseInt(props.match?.params?.id));
  },[props.fetch, props.match?.params?.id])
  

  if(loading || props.record === undefined){
    return <Loading />;
  }
  
  return (
    <LayoutWrapper>
      <DetailBase
        recordLibrary={ConferenceLibrary}
        actions={ConferenceActions}
        selector={ConferenceSelector}
        id={props.match?.params?.id}
      />
        <TabContext value={index}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList>
              <Tab label="Presentations" value="1" onClick={() => setIndex("1")} />
              <Tab label="Rooms" value="2"  onClick={() => setIndex("2")}/>
              {props.user.id === props.record.user_id || props.user.role === "admin" ? 
                  <Tab label="Visitors" value="3" onClick={() => setIndex("3")} />
                :
                ""
              }
            </TabList>
          </Box>
          <TabPanel value="1" style={{
                  paddingLeft: "0",
                  paddingRight: "0"
                }}>
            {(props.record.user_id === props.user.id || props.user.role === "admin") &&  
              <div>
                <p>Approve presentations: <Checkbox checked={presentationApproving} onChange={() => setPresentationApproving( ! presentationApproving)}/></p> 
              </div>
            }
            <PresentationIndex
              inDetail={true}
              fetchParams={{ conference_id: props.match?.params?.id }}
              presentationApproving={presentationApproving}
            />
          </TabPanel>
                
                <TabPanel value="2" style={{
                  paddingLeft: "0",
                  paddingRight: "0"
                }}>
                  <RoomIndex
                    inDetail={true}
                    fetchParams={{ conference_id: props.record.id }}
                  />
                </TabPanel>
             {props.user.id === props.record.user_id || props.user.role === "admin"? 
                
                <TabPanel value="3" style={{
                  paddingLeft: "0",
                  paddingRight: "0"
                }}>
                  <VisitorsPanel conference_id={props.record.id}/>
                </TabPanel>
                :
                ""
             }
            
        </TabContext>
      </LayoutWrapper>
  );
};
const mapStateToProps = (state, ownProps) => ({
  record: ownProps.match?.params?.id !== undefined ? ConferenceSelector.getById(state, ownProps.match?.params?.id) : ConferenceSelector.getFirstSelectedRecord(state),
  user: userSelector.getUser(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetch: () => dispatch(ConferenceActions.Fetch()),
  fetchParamsActions: (field, conference_id) => dispatch(fetchParamsActions.setFetchParam(field, conference_id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceDetail);
