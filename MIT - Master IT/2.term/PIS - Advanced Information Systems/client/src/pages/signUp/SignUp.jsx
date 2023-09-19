import { Paper, TextField, Button, Grid } from "@mui/material"
import { Container } from "@mui/system"
import Avatar from "../../components/Avatar/Avatar"
import { useNavigate } from "react-router"
import usersClient from "../../api/userClient"
import { useState } from "react"
import { connect } from "react-redux";
import userActions from "../../redux/users/userActions";
import userSelector from "../../redux/users/userSelector";
import validator from "../../utils/helpers/validators";


const SignUp = (props) => {
    const navigate = useNavigate();
    const [alreadySubmited, setAlreadySubmited] = useState(false)

    async function signup(){
        if( ! alreadySubmited){
            setAlreadySubmited(true);
        }

        if(validator.validatePassword(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited) 
        || validator.validatePasswordAgain(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited) 
        || validator.validateTel(props.registrationData.tel, alreadySubmited) 
        || validator.validateEmail(props.registrationData.email, alreadySubmited) 
        || validator.validateName(props.registrationData.name, alreadySubmited)){
            return;
        }
        if(await props.register(props.registrationData)){
            navigate("/home")
        }
    }




    return(
        <Container>
            <Paper elevation={5} style={{padding: "25px", margin: "auto", marginTop: "25px"}}>
            <Grid container>
                <Grid item md={6}>
                    <h4>Sign up</h4>
                    <TextField required value={props.registrationData.name} onChange={e => props.setName(e.target.value)} label="Name" variant="outlined" fullWidth margin="normal" error={validator.validateName(props.registrationData.name, alreadySubmited)} helperText={validator.validateName(props.registrationData.name, alreadySubmited)}/>
                    <TextField required value={props.registrationData.email} onChange={e => props.setEmail(e.target.value)} label="E-mail" variant="outlined" fullWidth margin="normal" type="email" error={validator.validateEmail(props.registrationData.email, alreadySubmited)} helperText={validator.validateEmail(props.registrationData.email, alreadySubmited)}/>
                    <TextField value={props.registrationData.tel} onChange={e => props.setTel(e.target.value)} label="Tel" variant="outlined" fullWidth margin="normal" type="tel" error={validator.validateTel(props.registrationData.tel, alreadySubmited)} helperText={validator.validateTel(props.registrationData.tel, alreadySubmited)}/>
                    <TextField required value={props.registrationData.password} onChange={e => props.setPassword(e.target.value)} label="Password" variant="outlined" type="password" fullWidth margin="normal" error={validator.validatePassword(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)} helperText={validator.validatePassword(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)} />
                    <TextField required value={props.registrationData.passwordAgain} onChange={e => props.setPasswordAgain(e.target.value)} label="Repeat password" variant="outlined" type="password" fullWidth margin="normal" error={validator.validatePasswordAgain(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)} helperText={validator.validatePasswordAgain(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)}/>

                </Grid>
                <Grid item md={6}>
                    <h4>Select your avatar</h4>
                    <div style={{padding: "25px"}}>
                        <Avatar avatar={props.registrationData.avatar} setAvatar={props.setAvatar}/>
                    </div>
                </Grid>
            </Grid>
            <Button variant="outlined" onClick={signup}>Sign up</Button>
            <Button variant="outlined" onClick={() => navigate("/signIn")}>Already have a account</Button>
            </Paper>
        </Container>
    )
}

const mapStateToProps = (state, ownProps) => ({
    registrationData: userSelector.getRegistration(state)
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    setName: (value) => dispatch(userActions.setRegistrationParam({field: "name", value})),
    setEmail: (value) => dispatch(userActions.setRegistrationParam({field: "email", value})),
    setTel: (value) => dispatch(userActions.setRegistrationParam({field: "tel", value})),
    setPassword: (value) => dispatch(userActions.setRegistrationParam({field: "password", value})),
    setPasswordAgain: (value) => dispatch(userActions.setRegistrationParam({field: "passwordAgain", value})),
    setAvatar: (value) => dispatch(userActions.setRegistrationParam({field: "avatar", value})),
    register: (user) => dispatch(userActions.register(user)),
  }); 
  
  export default connect(mapStateToProps, mapDispatchToProps)(SignUp);