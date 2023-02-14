import react, { useEffect} from "react";
import TeamDetailPlayerCard from "./TeamDetailPlayerCard/TeamDetailPlayerCard";
import { useHistory } from "react-router";
import entityLibrary from "../../models/utils/renderUtils/entityLibrary";
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import Model from "../../models/api/Model";
import Player from "../../models/Entities/Player";
import { RootState } from "../../app/store";
import { AsyncThunk, AnyAction } from '@reduxjs/toolkit';

interface Props{
    players: Player[] | undefined
}

function TeamDetailPlayerList(props: Props){

    if(props.players === undefined){
        return <div></div>;
    }

    return(
        <div className="row">
            {props.players.map((player, index) => {
                return (
                <div className="col-md-6">
                    <TeamDetailPlayerCard 
                        imageSrc={player.imagePath}
                        name={player.nickname ?? ""}
                        id={player.id}
                    />
                </div>
                )
            })

            }
        </div>
    )
}

export default TeamDetailPlayerList;