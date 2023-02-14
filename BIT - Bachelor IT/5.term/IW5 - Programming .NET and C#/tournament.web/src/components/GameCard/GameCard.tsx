import "./GameCard.css";
import Game from "../../models/Entities/Game";
import getImagePath from "../../utils/getImagePath";
import Moment from 'react-moment'; // used to format datetime
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
    delSelectedRecord,
    addSelectedRecord,
    selectIsSelected
  } from '../../features/models/game/gameSlice';

interface Props {
  game: Game;
}

function GameCard(props: Props) {

  const checked = useAppSelector(state => selectIsSelected(state, props.game));
  const dispatch = useAppDispatch();  

  function onClick(){
        if(checked){
            dispatch(delSelectedRecord(props.game));
        }
        else{
            dispatch(addSelectedRecord(props.game));
        }
    }
    
  return (
    <div className={"row GameCard p-1 " + (checked ? "checked" : "")} onClick={onClick}>
      <div className="col-2">
        <img
          className="teamLogo"
          src={getImagePath(props.game.teamRed?.imagePath)}
        />
      </div>
      <div className="col-8">
        <div className="row">
          <div className="col-5">
            <p className="TeamName">{props.game.teamRed?.name}</p>
          </div>
          <div className="col-2 VersusPanel">
            <p className="float-end">
              {props.game.teamRedPoints ?? "--"}
            </p>
            <p>:</p>
            <p>{props.game.teamBluePoints ?? "--"}</p>
          </div>
          <div className="col-5">
            <p className="TeamName float-end">{props.game.teamBlue?.name}</p>
          </div>
        </div>
        <div className="row datePanel m-4">
          <p className="m-0">
            <Moment format="DD.MM.YYYY hh:mm A">{props.game.start}</Moment>
            <span> - </span>
            <Moment format="DD.MM.YYYY hh:mm A">{props.game.end}</Moment>
          </p>
          <p className="m-0">{props.game.TournamentVenueName}</p>
        </div>
      </div>
      <div className="col-2">
        <img
          className="teamLogo"
          src={getImagePath(props.game.teamBlue?.imagePath)}
        />
      </div>
    </div>
  );
}

export default GameCard;
