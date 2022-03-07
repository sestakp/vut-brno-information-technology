/**
 * Author: Vojtěch Kulíšek
 */
import React from 'react';
import { connect} from "react-redux";
import selectedRecordsActions from '../../../../redux/selectedRecords/selectedRecordsActions';
import Checkbox from '@mui/material/Checkbox';
import "../Card.css";
import { useHistory } from 'react-router';
import userSelector from '../../../../redux/users/userSelector';

const RoomCard = (props) => {

    const history = useHistory();
    function onClick(){
        /*TODO check if user is admin or creator*/
        if(props.record.user_id === props.user.id || props.user.role === "admin"){
            if(props.checked){
                props.delete(props.record);
            }
            else{
                props.add(props.record);
            }
        }
        else{
            props.clear();
            props.add(props.record);
            history.push(props.detailLink+"/"+props.record.id);
        }
    }
                                                                                                              //Slice to remove one slash in url              
    let imageSrc = (props.record.image === undefined || props.record.image === null) ? "/~xsesta07/IIS/defaultImage.png" : process.env.REACT_APP_API_URL.slice(0, -1) + props.record.image
    return(
        <div className="col-lg-3 col-md-4 col-sm-6" >    
            <div className={"cardWrapper " + (props.checked ? "activeCard" : "")} onClick={onClick}>
                               
                <div className="card-body" style={{wordBreak: "break-word"}}>
                     <div className="row ">
                        <p style={{padding: 0, margin: 0, verticalAlign: "middle", lineHeight: "40px"}}>
                            {props.record.name}
                        </p>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}   
const mapStateToProps = (state, ownProps) => ({
    selectedRecords: ownProps.selector.getSelectedRecords(state),
    checked: ownProps.selector.isRecordSelected(state, ownProps.record),
    user: userSelector.getUser(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    add: (model) => {
        dispatch(ownProps.actions.AddToSelected(model));
    },
    delete: (model) => {
        dispatch(ownProps.actions.DeleteFromSelected(model));
    },
    clear: () => {
        dispatch(ownProps.actions.ClearSelected());
    },
  });
  
export default connect(mapStateToProps, mapDispatchToProps)(RoomCard);