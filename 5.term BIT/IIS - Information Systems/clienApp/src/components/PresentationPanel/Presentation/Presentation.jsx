/**
 * Author: Pavel Šesták
 */
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import PresentationActions from "../../../redux/presentations/presentationActions";
import { NavLink } from "react-router-dom";
import ButtonNormal from "../../ButtonNormal/ButtonNormal";
import "./Presentation.css";
function Presentation(props){


    return(
        <div className={"p-2"}>
            <NavLink className="row" to={"/conference/detail/"+props.presentation.conference_id}>
                <p>{props.presentation.name} ({props.presentation.state})</p>   
            </NavLink>
        </div>
    )
}


const mapStateToProps = (state, ownProps) => ({
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    DeletePresentation: (ticket) => dispatch(PresentationActions.Delete(ticket)),
    UpdatePresentation: (ticket) => dispatch(PresentationActions.Update(ticket)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(Presentation);