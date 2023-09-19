
import EditIcon from '@mui/icons-material/Edit';
import { connect } from "react-redux"
import React from 'react';
import ImageUpload from 'image-upload-react'
import roomsAction from '../../redux/rooms/roomActions';
import "./EditableImage.css"

const EditableImage = (props) => {

    const [isEditing, setIsEditing] = React.useState(false)


    if(isEditing){
        return(
            
            <div className="imgUpload" style={{display: "block", position: "relative"}}>
            <EditIcon onClick={() => setIsEditing(!isEditing)} style={{position: "absolute", top: "10px", right: "40px", color: "black"}}/>
                <ImageUpload
                    handleImageSelect={(e) => props.setImg(URL.createObjectURL(e.target.files[0]))}
                    imageSrc={props.img}
                    setImageSrc={() => props.updateImage(null)}
                    style={{
                        width: "95%",
                        height: "95%",
                        background: 'rgb(23, 79, 134)',
                        margin: "5%",
                        
                    }}
                />
            </div>
            )
    }

    return(
        <div style={{position: "relative"}}>
        <img src={props.img} style={{maxWidth: "100%"}}/>
        <EditIcon onClick={() => setIsEditing(!isEditing)} style={{position: "absolute", top: "20px", right: "20px", color: "white", backgroundColor: "rgba(0,0,0,0.5)"}}/>
    </div>
    )
}

const mapStateToProps = (state, ownProps) => ({

});

const mapDispatchToProps = (dispatch, ownProps) => ({

    updateImage: (newValue) => dispatch(roomsAction.updateField(ownProps.id, "image", newValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditableImage);