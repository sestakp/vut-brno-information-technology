import { Container, Grid, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
import EditableTextField from "../../../components/editableTextField/EditableTextField";
import authorizationSelector from "../../../redux/authorization/authorizationSelector";
import employeesAction from "../../../redux/employees/employeesActions";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";





const EmployeeProfile = (props) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(props.currentUser.email === ""){
            navigate("/home")
        }
    },[props.currentUser.email])

    return(
        <Container>
            <h2>Employee profile</h2>
            <Paper elevation={5} style={{marginBottom: "25px"}}>
                <Grid container>
                    <Grid item md={6}>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="First name"
                                    secondary={
                                        <EditableTextField value={props.currentUser.name} onUpdate={(val) => props.updateField(props.currentUser.id, "name", val)}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Surname"
                                    secondary={
                                        <EditableTextField value={props.currentUser.surname} onUpdate={(val) => props.updateField(props.currentUser.id, "surname", val)}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Email"
                                    secondary={
                                        <EditableTextField value={props.currentUser.email} onUpdate={(val) => props.updateField(props.currentUser.id,"email", val)} type="email"/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Role"
                                    secondary={
                                        <TextField variant="standard" fullWidth value={props.currentUser.role}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Salary"
                                    secondary={
                                        <TextField variant="standard" fullWidth value={props.currentUser.salary}/>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item md={6}>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="Bank Account"
                                    secondary={
                                        <EditableTextField type="bankAccount" value={props.currentUser.bankAccount} onUpdate={(val) => props.updateField(props.currentUser.id,"bankAccount", val)}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="City"
                                    secondary={
                                        <EditableTextField value={props.currentUser.address?.city} onUpdate={(val) => props.updateField(props.currentUser.id,"city", val)}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="State"
                                    secondary={
                                        <EditableTextField value={props.currentUser.address?.state} onUpdate={(val) => props.updateField(props.currentUser.id,"state", val)}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Street"
                                    secondary={
                                        <EditableTextField value={props.currentUser.address?.street} onUpdate={(val) => props.updateField(props.currentUser.id,"street", val)}/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Zip code"
                                    secondary={
                                        <EditableTextField value={props.currentUser.address?.zipCode} onUpdate={(val) => props.updateField(props.currentUser.id,"zipCode", val)} type="zipCode"/>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Password"
                                    secondary={
                                        <EditableTextField value={props.currentUser.password} type="password" onUpdate={(val) => props.updateField(props.currentUser.id,"password", val)}/>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}




const mapStateToProps = (state, ownProps) => ({
    currentUser: authorizationSelector.getUser(state),
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    updateField: (id, fieldName, newValue) => dispatch(employeesAction.updateField(id, fieldName, newValue)),
});

  
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeProfile);