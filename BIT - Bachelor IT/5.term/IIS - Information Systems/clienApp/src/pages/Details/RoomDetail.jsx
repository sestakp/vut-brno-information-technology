/**
 * Author: Vojtěch Kulíšek
 */
import React, { useEffect, useState } from "react";
import DetailBase from "./DetailBase"
import { PresentationIndex } from "../Indexes/PresentationIndex";
import RoomActions from "../../redux/rooms/roomActions";
import * as RoomLibrary from "../../utils/renderLibraries/RoomLibrary";
import RoomSelector from "../../redux/rooms/roomSelector";
import LayoutWrapper from "../../layouts/LayoutWrapper/LayoutWrapper";
import RoomTimeTable from "../../components/RoomTimeTable/RoomTimeTable";
import PresentationActions from "../../redux/presentations/presentationActions";
import PresentationSelector from "../../redux/presentations/presentationSelector";
import { connect } from "react-redux";
import Loading from "../../components/Loading/Loading";

const RoomDetail = (props) => {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        props.getById(props?.match?.params?.id).then(_ => setLoading(false));
        props.Fetch({room_id: props?.match?.params?.id}).then(_ => setLoading(false))
    }, [props.getById, props.Fetch, props.match])

    if(loading || props.record === undefined){
        return <Loading />;
    }
    return(
        <>
        <LayoutWrapper>
            <DetailBase 
                recordLibrary={RoomLibrary} 
                actions={RoomActions} 
                selector={RoomSelector}
                id={props?.match?.params?.id}
            />
        </LayoutWrapper>
        <RoomTimeTable 
        presentations={props.presentations}
        room_id={props?.match?.params?.id}
        />
        </>
    )

}

const mapStateToProps = (state, ownProps) => ({
    presentations: PresentationSelector.getAll(state), 
    record: RoomSelector.getById(state, ownProps.match?.params?.id),
 
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
      Fetch: (params) => dispatch(PresentationActions.Fetch(params)),
      getById: (id) => dispatch(RoomActions.GetById(id)),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(RoomDetail);