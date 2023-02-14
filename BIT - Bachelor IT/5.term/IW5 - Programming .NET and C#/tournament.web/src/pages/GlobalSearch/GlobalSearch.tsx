import react, {useEffect} from "react";
import { getSearchText, search, getSearchModel} from "../../features/search/searchSlice"
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Card from "../../components/CardTable/Cards/Card";
import * as playerLibrary from "../../utils/renderUtils/playerLibrary";
import * as teamLibrary from "../../utils/renderUtils/teamLibrary";
import * as tournamentVenueLibrary from "../../utils/renderUtils/tourmaneVenueLibrary";
import { useHistory } from "react-router";

import {
    selectIsSelected as playerSelectIsSelected
  }  from '../../features/models/player/playerSlice';

import {
    selectIsSelected as teamSelectIsSelected
  } from '../../features/models/team/teamSlice';

import {
    selectIsSelected as tournamentVenueIsSelectIsSelected
  } from '../../features/models/tournamentVenue/tournamentVenueSlice';

interface Props{

}

function GlobalSearch(props: Props){

    const dispatch = useAppDispatch();
    const history = useHistory();
    const searchText = useAppSelector(getSearchText);
    const searchModel = useAppSelector(getSearchModel);


    if(searchText === undefined || searchText === ""){
        history.goBack();
    }

    useEffect(() => {
        dispatch(search(searchText))
    },[searchText])



    console.log("search model: ", searchModel);
    return (
    <div>
        <h2>Global search</h2>
        <h3>Players</h3>
        
        <div className="row"> 
        {searchModel?.players?.map((record, index) => {
            return <Card
                key={"CardTable_players_"+index}
                record={record}
                cardTableSetTitle={playerLibrary.cardTableSetTitle}
                cardTableSetDescription={playerLibrary.cardTableSetDescription}
                cardTableHasImage={true}
                cardTableSetFooter={playerLibrary.cardTableSetFooter}
                selectIsSelected={playerSelectIsSelected}
            />
        })}
        </div>
       
        <h3>Teams</h3>        
        <div className="row">
            {searchModel?.teams?.map((record, index) => {
                return <Card
                    key={"CardTable_teams_"+index}
                    record={record}
                    cardTableSetTitle={teamLibrary.cardTableSetTitle}
                    cardTableSetDescription={teamLibrary.cardTableSetDescription}
                    cardTableHasImage={true}
                    cardTableSetFooter={teamLibrary.cardTableSetFooter}
                    selectIsSelected={teamSelectIsSelected}
                />
            })}
        </div>
        
        <h3>Tournament venues</h3>
        <div className="row">        
            {searchModel?.tournamentVenues?.map((record, index) => {
                return <Card
                    key={"CardTable_tournament_venues_"+index}
                    record={record}
                    cardTableSetTitle={tournamentVenueLibrary.cardTableSetTitle}
                    cardTableSetDescription={tournamentVenueLibrary.cardTableSetDescription}
                    cardTableHasImage={false}
                    cardTableSetFooter={tournamentVenueLibrary.cardTableSetFooter}
                    selectIsSelected={tournamentVenueIsSelectIsSelected}
                />
            })}
        </div>

    </div>
    )
}

export default GlobalSearch;