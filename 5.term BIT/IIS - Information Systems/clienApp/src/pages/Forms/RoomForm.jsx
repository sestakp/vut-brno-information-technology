/**
 * Author: Pavel Šesták
 */
import { useEffect } from "react";
import FormBase from "./FormBase";
import RoomActions from "../../redux/rooms/roomActions";
import * as RoomLibrary from "../../utils/renderLibraries/RoomLibrary";
import RoomSelector from "../../redux/rooms/roomSelector";
import ConferenceSelector from "../../redux/conferences/conferenceSelector";
import { connect } from "react-redux";
import { useHistory } from "react-router";
import fetchParamSelector from "../../redux/fetchParams/fetchParamsSelector";
import ConferenceActions from "../../redux/conferences/conferenceActions";

function RoomForm(props){
    
    let conference_id =  props.conference?.id ?? props.fetchParams?.conference_id ?? props.conference_id;
    //check props, when error(user refresh page) redirect
    const history = useHistory();



    useEffect(() => {
        props.fetchConferences();
    },[conference_id])


    if(props.conference === undefined){
        return "";
    }


    let formData = {
        conference_id: conference_id,
        conferences: props.conferences,
    };
    
    return(
        <FormBase 
            recordLibrary={RoomLibrary} 
            actions={RoomActions} 
            selector={RoomSelector}
            formData={formData}
        />
    )
}


const mapStateToProps = (state, ownProps) => ({
    conference: ConferenceSelector.getById(state, fetchParamSelector.getParam(state, "conference_id")),
    conferences: ConferenceSelector.getAll(state),
    conference_id: fetchParamSelector.getParam(state, "conference_id"),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchConferences: () => dispatch(ConferenceActions.Fetch()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomForm);