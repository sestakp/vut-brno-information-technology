/**
 * Author: Vojtěch Kulíšek
 */
import React from "react";
import {AiOutlineCloseCircle} from "react-icons/ai"

const Image = (props) => {
  return (
    <div className="file-item d-flex align-items-center justify-content-md-center " >
      <img alt={'img - '+ props.image} src={props.image} className="file-img mw-100"  style={{maxHeight: "100px"}}/>
      <p onClick={() => {props.setImage(null); props.changeFunc(null)}} style={{width: "100px"}}><AiOutlineCloseCircle size={40} style={{color: "black"}}/></p>
    </div>
  );
};

export default Image;