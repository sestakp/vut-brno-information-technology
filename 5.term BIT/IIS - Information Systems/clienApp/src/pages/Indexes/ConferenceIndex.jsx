/**
 * Author: Pavel Šesták
 */
import IndexBase from "./IndexBase";
import ConferenceActions from "../../redux/conferences/conferenceActions";
import * as ConferenceLibrary from "../../utils/renderLibraries/ConferenceLibrary";
import ConferenceSelector from "../../redux/conferences/conferenceSelector";
import ConferenceDetail from "../Details/ConferenceDetail";
import { useEffect } from "react";
import RecordEditPanel from "../../components/RecordEditPanel/RecordEditPanel";
import LayoutWrapper from "../../layouts/LayoutWrapper/LayoutWrapper";
import ConferenceCard from "../../components/CardTable/Cards/ConferenceCard/ConferenceCard";
import TicketActions from "../../redux/tickets/ticketActions";
import userSelector from "../../redux/users/userSelector";
import { connect } from "react-redux";

function ConferenceIndex(props){
    
    useEffect(() => {
        props.fetchTickets({ user_id: props.user?.id, });
    },[props])

    return(
        <>
            <IndexBase 
                header="Conferences"
                collection="conference"
                actions={ConferenceActions}
                recordLibrary={ConferenceLibrary}
                selector={ConferenceSelector}
                redirectPath={props.redirectPath}            
                inDetail={props.inDetail}
                detailLink={"/conference/detail"}
                updateLink={"/conference/update"}
                cardTableHasImage={true}
                Card={ConferenceCard}
            />
        </>
    )
}


const mapStateToProps = (state, ownProps) => ({
    user: userSelector.getUser(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchTickets: (fetchParams) => dispatch(TicketActions.Fetch(fetchParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConferenceIndex);