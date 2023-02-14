/**
 * Author: Vojtěch Kulíšek
 */
import react, { useEffect, useState } from "react";
import DetailBase from "./DetailBase"
import { PresentationIndex } from "../Indexes/PresentationIndex";
import PresentationActions from "../../redux/presentations/presentationActions";
import * as PresentationLibrary from "../../utils/renderLibraries/PresentationLibrary";
import PresentationSelector from "../../redux/presentations/presentationSelector";
import LayoutWrapper from "../../layouts/LayoutWrapper/LayoutWrapper";
import Loading from "../../components/Loading/Loading";
import { connect, useSelector } from "react-redux";
import Stream from "../../components/Stream/Stream";
import ConferenceSelector from "../../redux/conferences/conferenceSelector";
import ConferenceActions from "../../redux/conferences/conferenceActions";
import userSelector from "../../redux/users/userSelector";
import TicketSelector from "../../redux/tickets/ticketSelector";
import TicketActions from "../../redux/tickets/ticketActions";

const PresentationDetail = (props) => {
    
    useEffect(()=> {
        props.getById(props?.match?.params?.id);
    },[props.getById, props.match]);




    if(props.loading || props.record === undefined){
        return <Loading />;
    }

    return(
        <>
        <Stream
            stream_link={props.record?.stream_link}
        />
        <LayoutWrapper>
            <DetailBase 
                recordLibrary={PresentationLibrary} 
                actions={PresentationActions} 
                selector={PresentationSelector}
                id={props?.match?.params?.id}
            />
        </LayoutWrapper>
        </>
    )

}

const mapStateToProps = (state, ownProps) => ({
        record: PresentationSelector.getById(state, ownProps.match?.params?.id),
        user: userSelector.getUser(state),
        loading: PresentationSelector.isLoading(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    getById: (id) => dispatch(PresentationActions.GetById(id)),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(PresentationDetail);