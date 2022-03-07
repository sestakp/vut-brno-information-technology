import React from 'react'
import "./Card.css";

const Card = (props) => {

    let imageSrc = props.record.imagePath === null ? "./defaultImage.png" : process.env.REACT_APP_URL + props.record.imagePath
    return(
        <div className="col-lg-3 col-md-4 col-sm-6" >
            <div className="cardWrapper">
                <img className="card-img-top mh-5" src={imageSrc} alt="person card"/>
                <div className="card-body">
                    <h5 className="card-title">{props.title}</h5>
                    <p className="card-text">{props.description}</p>
                    <div className="row">
                        <div className="col-lg-6 p-0 pb-1">
                            <button onClick={() => props.handleEdit(props.record)} className="btn btn-primary w-100">Edit</button>
                        </div>
                        <div className="col-lg-6 p-0 pb-1">
                            <button onClick={() => props.handleDelete(props.record)} className="btn btn-danger w-100">Delete</button>
                        </div>
                    </div>
                    <div className="row">
                        <button onClick={() => props.handleDetail(props.record)} className="btn btn-secondary w-100">Detail info</button>
                    </div>
                </div>
            </div>
        </div>
    )
}   

export default Card;