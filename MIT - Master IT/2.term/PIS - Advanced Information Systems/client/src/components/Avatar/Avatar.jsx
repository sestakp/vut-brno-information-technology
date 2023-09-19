import React from "react"

import EditAvatar from 'react-avatar-edit'
export default function Avatar(props) {
    
    function onClose() {
      props.setAvatar(null)
    }
    
    function onCrop(preview) {
      props.setAvatar(preview)
    }
  
    function onBeforeFileLoad(elem) {
      if(elem.target.files[0].size > 71680){
        alert("File is too big!");
        elem.target.value = "";
      };
    }


      return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <div style={{backgroundColor: "rgba(255,255,255,0.5)", borderRadius: "6px"}}>
                <EditAvatar
                    width={390}
                    height={295}
                    onCrop={onCrop}
                    onClose={onClose}
                    onBeforeFileLoad={onBeforeFileLoad}
                    src={null}
                    
                />
            </div>
          
          {props.avatar &&
          <div style={{ marginTop: "25px"}}>
            <h4>Avatar preview</h4>
            <img src={props.avatar} alt="Preview"  style={{border: "1px solid black", borderRadius: "50%"}}/>
          </div>
          }
        </div>
      )
  }
