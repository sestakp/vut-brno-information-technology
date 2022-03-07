import React from "react";
import {AiOutlineCloseCircle} from "react-icons/ai"
const Image = ({ image, setImage, changeFunc }) => {
  return (
    <div className="file-item d-flex align-items-center justify-content-md-center" >
      <img alt={`img - ${image.id}`} src={image.src} className="file-img"  style={{maxHeight: "100px"}}/>
      <p onClick={() => {setImage(null); changeFunc(null)}} style={{width: "100px"}}><AiOutlineCloseCircle size={40} style={{color: "black"}}/></p>
    </div>
  );
};

export default Image;