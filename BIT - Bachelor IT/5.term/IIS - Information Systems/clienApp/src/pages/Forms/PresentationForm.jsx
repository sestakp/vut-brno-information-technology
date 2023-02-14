/**
 * Author: Pavel Šesták
 */
import { useState,useEffect } from "react";
import FormBase from "./FormBase";
import PresentationActions from "../../redux/presentations/presentationActions";
import * as PresentationLibrary from "../../utils/renderLibraries/PresentationLibrary";
import PresentationSelector from "../../redux/presentations/presentationSelector";
import ConferenceSelector from "../../redux/conferences/conferenceSelector";
import RoomSelector from "../../redux/rooms/roomSelector";
import RoomActions from "../../redux/rooms/roomActions";
import { connect } from "react-redux";
import userSelector from "../../redux/users/userSelector";
import ConferenceActions from "../../redux/conferences/conferenceActions";
import fetchParamSelector from "../../redux/fetchParams/fetchParamsSelector";



function PresentationForm(props){
    const [isOwner, setIsOwner] = useState(false);

    let conference_id =  props.conference?.id ?? props.fetchParams?.conference_id ?? props.conference_id;


    useEffect(() => {
        setIsOwner(props.user.role === 'admin' || props.user.id === props.conference?.user_id)
    }, [props.user, props.conference])


    let formData = {
        rooms: props.rooms,
        conference_id: conference_id,
        conferences: props.conferences.filter(x => x.id === conference_id || props.user.role === "admin" || props.user.id === x.user_id),
        conference: props.conference,
    };

    useEffect(() => {
        props.fetchRooms({conference_id: conference_id});
        props.fetchConferences();
    },[conference_id])

    return(
        <FormBase
            recordLibrary={PresentationLibrary} 
            actions={PresentationActions} 
            selector={PresentationSelector}
            formData={formData}
            isOwner={isOwner}
        />
    )
}

const mapStateToProps = (state, ownProps) => ({
    rooms: RoomSelector.getAll(state),
    user: userSelector.getUser(state),
    conferences: ConferenceSelector.getAll(state),
    conference_id: fetchParamSelector.getParam(state, "conference_id"),
    conference: ConferenceSelector.getById(state, fetchParamSelector.getParam(state, "conference_id")),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchRooms: (fetchParams) => dispatch(RoomActions.Fetch(fetchParams)),
    fetchConferences: () => dispatch(ConferenceActions.Fetch()),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(PresentationForm);