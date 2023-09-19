import { Container, Paper, Grid } from "@mui/material"
import ReviewForm from "../../components/reviewForm/ReviewForm"
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import EditableTextField from "../../components/editableTextField/EditableTextField";
import userSelector from "../../redux/users/userSelector";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import userActions from "../../redux/users/userActions";
import CurrentReservationPaper from "../../components/currentReservationPaper/CurrentReservationPaper";
import FutureReservationPaper from "../../components/FutureReservationPaper/FutureReservationPaper";
import PassedReservationPaper from "../../components/passedReservationPaper/PassedReservationPaper";
import authorizationSelector from "../../redux/authorization/authorizationSelector";
import UserProfile from "./UserProfile/UserProfile";
import EmployeeProfile from "./EmployeeProfile/EmployeeProfile";


const Profile = (props) => {

    if(props.currentUser.role === undefined){
        return <UserProfile />
    }

    return <EmployeeProfile />
}


const mapStateToProps = (state, ownProps) => ({
    currentUser: authorizationSelector.getUser(state),
    });
  
const mapDispatchToProps = (dispatch, ownProps) => ({
});

  
export default connect(mapStateToProps, mapDispatchToProps)(Profile);