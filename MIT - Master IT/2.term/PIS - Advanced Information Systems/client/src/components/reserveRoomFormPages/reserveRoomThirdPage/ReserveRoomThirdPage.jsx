import { Button, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import authorizationActions from "../../../redux/authorization/authorizationActions";
import authorizationSelector from "../../../redux/authorization/authorizationSelector";
import reservationsSelector from "../../../redux/reservations/reservationSelector";
import userActions from "../../../redux/users/userActions";
import userSelector from "../../../redux/users/userSelector";
import getReservationSumPrice from "../../../utils/helpers/getReservationSumPrice";
import validator from "../../../utils/helpers/validators";
import roles from "../../../utils/roles";
import Avatar from "../../Avatar/Avatar";
import reservationActions from "../../../redux/reservations/reservationActions";

const ReserveRoomThirdPage = (props) => {
    const navigate = useNavigate();
    const [alreadySubmited, setAlreadySubmited] = useState(false);

    useEffect(() => {
        console.log("useeffect: ", props.currentUser)
        if (props.currentUser.email !== "") {
            if (props.currentUser.role !== roles.CUSTOMER) {
                console.log("CALLING GET USERS")
                props.getUsers();
            }
        }
    }, [props.currentUser]);

    console.log("users: ", props.users)

    async function signup() {
        if (!alreadySubmited) {
            setAlreadySubmited(true);
        }

        if (
            validator.validatePassword(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited) ||
            validator.validatePasswordAgain(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited) ||
            validator.validateTel(props.registrationData.tel, alreadySubmited) ||
            validator.validateEmail(props.registrationData.email, alreadySubmited) ||
            validator.validateName(props.registrationData.name, alreadySubmited)
        ) {
            return;
        }
        await props.register(props.registrationData);
    }

    let sum_price = getReservationSumPrice(props.reservation);

    if (props.currentUser.role === roles.COOK || props.currentUser.role === roles.CLEANER) {
        navigate("/home");
    }

    if (props.currentUser.email !== "") {
        console.log(props.users);
        return (
            <div style={{ padding: "25px" }}>
                <Grid container>
                    {props.currentUser.role === roles.CUSTOMER && (
                        <>
                            <h3>Current user</h3>
                            <Grid item md={5}>
                                <List>
                                    <ListItem>
                                        <ListItemText primary="Name" secondary={<TextField InputProps={{ readOnly: true}} value={props.currentUser.name} />} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="E-mail" secondary={<TextField InputProps={{ readOnly: true}} value={props.currentUser.email} type="email" />} />
                                    </ListItem>
                                    <ListItem>
                                        <ListItemText primary="Telephone" secondary={<TextField InputProps={{ readOnly: true}} value={props.currentUser.tel} type="tel" />} />
                                    </ListItem>
                                </List>
                            </Grid>
                        </>
                    )}
                    {props.currentUser.role !== roles.CUSTOMER && (
                        <>
                            <Grid item md={5}>
                                {/* TODO: vyřešit předání usera do parent compomenenty  */}
                                {props.users && (
                                    <>
                                        <InputLabel id="client-id-label">Select user</InputLabel>
                                        <Select
                                        labelId="client-id-label"
                                        value={props.clientId}
                                        autoWidth
                                        onChange={(e) => props.setClientId(e.target.value)}
                                        >
                                            <MenuItem value={undefined}></MenuItem>
                                            {props.users.map((client) => (
                                                <MenuItem value={client.id}>{client.email}</MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                            </Grid>
                        </>
                    )}
                    <Grid item md={5}>
                        <p>
                            <b>Total price ${sum_price}</b>
                        </p>
                    </Grid>
                </Grid>
            </div>
        );
    }

    return (
        <div style={{ padding: "25px" }}>
            <Grid container>
                <Grid item md={6}>
                    <h4>Register</h4>
                    <TextField
                        required
                        value={props.registrationData.name}
                        onChange={(e) => props.setRegistrationName(e.target.value)}
                        label="Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        error={validator.validateName(props.registrationData.name, alreadySubmited)}
                        helperText={validator.validateName(props.registrationData.name, alreadySubmited)}
                    />
                    <TextField
                        required
                        value={props.registrationData.email}
                        onChange={(e) => props.setRegistrationEmail(e.target.value)}
                        label="E-mail"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        error={validator.validateEmail(props.registrationData.email, alreadySubmited)}
                        helperText={validator.validateEmail(props.registrationData.email, alreadySubmited)}
                    />
                    <TextField
                        value={props.registrationData.tel}
                        onChange={(e) => props.setRegistrationTel(e.target.value)}
                        label="Tel"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        error={validator.validateTel(props.registrationData.tel, alreadySubmited)}
                        helperText={validator.validateTel(props.registrationData.tel, alreadySubmited)}
                    />
                    <TextField
                        required
                        value={props.registrationData.password}
                        onChange={(e) => props.setRegistrationPassword(e.target.value)}
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        error={validator.validatePassword(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)}
                        helperText={validator.validatePassword(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)}
                    />
                    <TextField
                        required
                        value={props.registrationData.passwordAgain}
                        onChange={(e) => props.setRegistrationPasswordAgain(e.target.value)}
                        label="Repeat password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                        error={validator.validatePasswordAgain(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)}
                        helperText={validator.validatePasswordAgain(props.registrationData.password, props.registrationData.passwordAgain, alreadySubmited)}
                    />
                    <Button variant="outlined" onClick={() => signup()} style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
                        Sign up
                    </Button>

                    <h4>Already have a account?</h4>
                    <TextField
                        value={props.loginData.name}
                        onChange={(e) => props.setLoginName(e.target.value)}
                        label="E-mail"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                    />
                    <TextField
                        value={props.loginData.password}
                        onChange={(e) => props.setLoginPassword(e.target.value)}
                        label="Password"
                        variant="outlined"
                        type="password"
                        fullWidth
                        margin="normal"
                        style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
                    />
                    <Button variant="outlined" onClick={() => props.login(props.loginData)} style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
                        Sign in
                    </Button>
                </Grid>
                <Grid item md={6}>
                    <h4>Select your avatar</h4>
                    <div style={{ padding: "25px" }}>
                        <Avatar avatar={props.registrationData.avatar} setAvatar={props.setRegistrationAvatar} />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    currentUser: authorizationSelector.getUser(state),
    loginData: authorizationSelector.getLogin(state),
    registrationData: userSelector.getRegistration(state),
    reservation: reservationsSelector.getReservation(state),
    users: userSelector.getAll(state),
    clientId: reservationsSelector.getClientId(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setLoginPassword: (value) => dispatch(authorizationActions.setLoginParam({ field: "password", value })),
    setLoginName: (value) => dispatch(authorizationActions.setLoginParam({ field: "name", value })),

    login: (credentials) => dispatch(authorizationActions.login(credentials)),

    getUsers: () => dispatch(userActions.GetAll()),
    setClientId: (clientId) => dispatch(reservationActions.setClientId(clientId)),
    setRegistrationName: (value) => dispatch(userActions.setRegistrationParam({ field: "name", value })),
    setRegistrationEmail: (value) => dispatch(userActions.setRegistrationParam({ field: "email", value })),
    setRegistrationTel: (value) => dispatch(userActions.setRegistrationParam({ field: "tel", value })),
    setRegistrationPassword: (value) => dispatch(userActions.setRegistrationParam({ field: "password", value })),
    setRegistrationPasswordAgain: (value) => dispatch(userActions.setRegistrationParam({ field: "passwordAgain", value })),
    setRegistrationAvatar: (value) => dispatch(userActions.setRegistrationParam({ field: "avatar", value })),

    register: (user) => dispatch(userActions.register(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReserveRoomThirdPage);
