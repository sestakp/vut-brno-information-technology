/**
 * Author: Lukáš Plevač
 */
import React from "react";
import {AiOutlineCloseCircle} from "react-icons/ai"

const Image = (props) => {
  return (
    <div className="file-item d-flex align-items-center justify-content-md-center" >
      <p className="file-img"  style={{maxHeight: "100px", wordBreak: "break-all"}}>{props.image}</p>
      <p onClick={() => {props.setImage(null); props.changeFunc(null)}} style={{width: "100px"}}><AiOutlineCloseCircle size={40} style={{color: "black"}}/></p>
    </div>
  );
};

export default Image;