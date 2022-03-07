import "./TeamDetailPlayerCard.css";
import { NavLink } from "react-router-dom";

interface Props{
  name: string | undefined,
  imageSrc: string | undefined,
  id: string,
}

function TeamDetailPlayerCard(props: Props) {

  let imageSrc = "/defaultImage.png";

  if(props.imageSrc !== undefined && process.env.REACT_APP_API_URL !== undefined){
    imageSrc = process.env.REACT_APP_API_URL + props.imageSrc;
  }

  return (
      <NavLink to={"/Player/Detail/"+props.id}>
      <div className="row playerDetail p-1">
        <div className="col-md-6 namePanel">
          <p className="playerName">{props.name}</p>
        </div>
        <div className="col-md-6 photoPanel">
          <img className="float-end playerPhoto" src={imageSrc}/>
        </div>
      </div>
      </NavLink>
  );
}

export default TeamDetailPlayerCard;
