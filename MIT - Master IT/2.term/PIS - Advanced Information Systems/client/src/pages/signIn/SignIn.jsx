import { Paper, TextField, Button } from "@mui/material"
import { Container } from "@mui/system"
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import usersClient from "../../api/userClient";
import { connect } from "react-redux";
import userActions from "../../redux/users/userActions";
import userSelector from "../../redux/users/userSelector";
import authorizationActions from "../../redux/authorization/authorizationActions";
import authorizationSelector from "../../redux/authorization/authorizationSelector";

const SignIn = (props) => {
    const navigate = useNavigate()


    async function signIn(){
        if(await props.login(props.loginData)){
            navigate("/profile")
        }
    }

    return(
        <Container>
            <Paper elevation={5} style={{padding: "25px", width: "300px", margin: "auto", marginTop: "25px"}}>
                <TextField label="E-mail" variant="outlined" type="email" fullWidth margin="normal" value={props.loginData.name} onChange={(e) => props.setName(e.target.value)}/>
                <TextField label="Password" type="password" variant="outlined" fullWidth margin="normal" value={props.loginData.password} onChange={(e) => props.setPassword(e.target.value)}/>
                <Button variant="outlined" onClick={signIn}>SIGN IN</Button>
                <Button variant="outlined" onClick={() => navigate("/signUp")}>I don't have a account</Button>
            </Paper>
        </Container>
    )
}

const mapStateToProps = (state, ownProps) => ({
    loginData: authorizationSelector.getLogin(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    login: (credentials) => dispatch(authorizationActions.login(credentials)),
    setName: (value) => dispatch(authorizationActions.setLoginParam({field: "name", value})),
    setPassword: (value) => dispatch(authorizationActions.setLoginParam({field: "password", value})),
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(SignIn);