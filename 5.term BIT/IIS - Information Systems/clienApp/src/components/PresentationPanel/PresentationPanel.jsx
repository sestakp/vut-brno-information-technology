/**
 * Author: Vojtěch Kulíšek
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userClient from '../../api/userClient';
import ticketClient from '../../api/ticketClient';
import { setCurrentUser } from '../../redux/users/userActions';
import userSelector from '../../redux/users/userSelector';
import ButtonForm from '../ButtonForm/ButtonForm';
import InputForm from '../InputForm/InputForm';
import { connect } from "react-redux";
import PresentationSelector from '../../redux/presentations/presentationSelector';
import PresentationActions from '../../redux/presentations/presentationActions';
import Presentation from './Presentation/Presentation';
import _ from "underscore";
import ConferenceSelector from '../../redux/conferences/conferenceSelector';
import ConferenceActions from '../../redux/conferences/conferenceActions';

function PresentationPanel(props){

    useEffect(() => {
        props.fetchPresentations({ user_id: props.user?.id, });
        props.fetchConferences();
    }, [])

    let conferences = _.groupBy(props.presentations,  'conference_id');
    

    return (
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <section>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-6 bg-white-no-important dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 sm:p-6">
                            <div>
                                <h2 className="text-lg font-medium leading-6">
                                    Presentations
                                </h2>
                            </div>
                            {Object.keys(conferences).map((id, index) => {
                                let conference = props.conferences.filter(x => x.id == id)[0];
                                let presentations = conferences[id].map((presentation) => <Presentation key={presentation.id} presentation={presentation}/>)

                                return (
                                    <>
                                        <h3 className="text-lg font-medium leading-6">{conference?.name}</h3>
                                        {presentations}
                                    </>
                                )  
                            })}
                        </div>
                    </div>
            </section>
        </div>
    );
}


const mapStateToProps = (state, ownProps) => ({
    presentations: PresentationSelector.getPresentationsByUser(state, userSelector.getUser(state).id),
    conferences: ConferenceSelector.getAll(state),
    user: userSelector.getUser(state),
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    fetchPresentations: (fetchParams) => dispatch(PresentationActions.Fetch(fetchParams)),
    fetchConferences: (fetchParams) => dispatch(ConferenceActions.Fetch(fetchParams)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(PresentationPanel);