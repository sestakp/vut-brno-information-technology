import react, {useEffect} from "react";
import IndexBase from "./IndexBase";
import gameClient from "../../api/gameClient";
import {
    fetchAsync,
    selectAll,
    clearSelectedRecords,
    selectFirstSelectedRecord,
    selectIsAnyRecordSelected,
    selectIsOneRecordSelected,
    selectIsLoading,
    deleteAsync,
    selectSelectedRecords,
  } from '../../features/models/game/gameSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { useHistory } from "react-router";
import GameCard from "../../components/GameCard/GameCard";
import Game from "../../models/Entities/Game";
import RecordEditPanel from "../../components/RecordEditPanel/RecordEditPanel";


import Loading from "../../components/Loading/Loading";
import "./IndexBase.css";

interface Props{

}

export default function GameIndex(props: Props){
    const history = useHistory();
    const dispatch = useAppDispatch();

    const games:Game[]  = useAppSelector(selectAll);
    const isLoading:boolean = useAppSelector(selectIsLoading);

    useEffect(()=> {
        dispatch(fetchAsync());
    },[])

    if(isLoading){
        return <Loading/>;
    }

    return(
        <>
            <RecordEditPanel 
                clearSelectedRecords={clearSelectedRecords}
                detailLink={"Game/Detail"}
                updateLink={"Game/Update"}
                selectFirstSelectedRecord={selectFirstSelectedRecord}
                selectIsAnyRecordSelected={selectIsAnyRecordSelected}
                selectIsOneRecordSelected={selectIsOneRecordSelected}
                deleteAsync={deleteAsync}
                selectSelectedRecords={selectSelectedRecords}
            />
            <div className="row">
                <div className="col-md-6">
                    <h1>Games</h1>
                </div>
                <div className="col-md-6 button-pos">
                    <button className="btn btn-color float-end" onClick={() => {dispatch(clearSelectedRecords()); history.push("Game/Update");}}>
                        Add
                    </button>
                </div>
            </div>
            {games.map((game, index) => <GameCard game={game} key={"game_"+index}/>) }
        </>
    )
}