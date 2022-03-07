import React from 'react';
import "./Card.css";
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { RootState } from '../../../app/store';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import Model from "../../../models/api/Model";

interface Props{
    cardTableSetTitle: (record:any) => string,
    cardTableSetDescription: (record:any) => string,
    cardTableSetFooter: (record:any) => string,
    selectIsSelected: (state: RootState, record: Model) => boolean,
    record: any,
    
    addSelectedRecord?: ActionCreatorWithPayload<Model, string>,
    delSelectedRecord?: ActionCreatorWithPayload<Model, string>,
    cardTableHasImage: boolean
}

const Card = (props: Props) => {

    const dispatch = useAppDispatch();
    
    const checked = useAppSelector(state => props.selectIsSelected(state, props.record));
    

    function onClick(){
        if(checked){
            if(props.delSelectedRecord !== undefined){
                dispatch(props.delSelectedRecord(props.record));
            }
        }
        else{
            if(props.addSelectedRecord !== undefined){
                dispatch(props.addSelectedRecord(props.record));
            }
        }
    }

    let imageSrc = "/defaultImage.png";

    if(props.record.imagePath !== undefined && props.record.imagePath !== null && process.env.REACT_APP_API_URL !== undefined){
        imageSrc = process.env.REACT_APP_API_URL.slice(0, -1) + props.record.imagePath;
    }
    
    return(
        <div className="col-lg-3 col-md-4 col-sm-6" >    
            <div className={"cardWrapper " + (checked ? "activeCard" : "")} onClick={onClick}>
                {props.cardTableHasImage ? 
                <div style={{position: "relative"}}>
                    <img className="card-img-top mh-5" src={imageSrc} alt={"card image"+imageSrc}/>
                </div>
                :""
                }
                
                <div className="card-body">
                     <div className="row border-bottom">
                        <p style={{padding: 0, margin: 0, verticalAlign: "middle", lineHeight: "40px"}}>
                            {props.cardTableSetTitle(props.record)}
                        </p>
                    </div>
                    <div className="row border-bottom">
                        <p>
                            {props.cardTableSetDescription(props.record)}
                        </p>
                    </div>
                    <div className="row">
                        <p>
                            {props.cardTableSetFooter(props.record)}
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Card;
