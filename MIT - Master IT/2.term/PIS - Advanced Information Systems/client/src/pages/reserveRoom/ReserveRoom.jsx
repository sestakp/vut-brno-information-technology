import * as React from "react";
import { Grid, Container, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ReserveRoomFirstPage from "../../components/reserveRoomFormPages/reserveRoomFirstPage/ReserveRoomFirstPage";
import ReserveRoomSecondPage from "../../components/reserveRoomFormPages/reserveRoomSecondPage/ReserveRoomSecondPage";
import "./ReserveRoom.css";
import ReserveRoomThirdPage from "../../components/reserveRoomFormPages/reserveRoomThirdPage/ReserveRoomThirdPage";
import { connect } from "react-redux";
import reservationActions from "../../redux/reservations/reservationActions";
import reservationsSelector from "../../redux/reservations/reservationSelector";
import userSelector from "../../redux/users/userSelector";
import { setNotification } from "../../redux/notifications/notificationActions";
import authorizationSelector from "../../redux/authorization/authorizationSelector";
import { useEffect } from "react";
const steps = ["Select room", "Above standard services", "Personal informations"];

const ReserveRoom = (props) => {
    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        if (activeStep === 0) {
            if (props.reservation.selectedRooms.length < 1) {
                props.setNotification("Select a room to continue");
                return;
            }

            if (props.reservation.numberOfAdults + props.reservation.numberOfChilds == 0) {
                props.setNotification("Reservation guests are not selected");
                return;
            }

            var tempAdults = 0;
            var tempChildren = 0;

            var reservedRooms = props.reservation.rooms.filter((r) => props.reservation.selectedRooms.includes(r.id));
            for (var i = 0; i < reservedRooms.length; i++) {
                tempAdults += reservedRooms[i].numberOfAdults;
                tempChildren += reservedRooms[i].numberOfChilds;
            }

            if (tempAdults < props.reservation.numberOfAdults) {
                props.setNotification("Not enought rooms for selected number of adults");
                return;
            }

            if (tempChildren < props.reservation.numberOfChilds) {
                props.setNotification("Not enought rooms for selected number of children");
                return;
            }
        }

        if (activeStep === 1) {
            let numbOfBreakfast = Number(props.reservation.normalBreakfast);
            numbOfBreakfast += Number(props.reservation.vegetarianBreakfast);
            numbOfBreakfast += Number(props.reservation.veganBreakfast);

            let numberOfGuests = props.reservation.numberOfAdults + props.reservation.numberOfChilds;

            if (numbOfBreakfast > numberOfGuests) {
                props.setNotification("Number of breakfasts is greated then number of guests");
                return;
            }
        }

        if (activeStep === steps.length - 1) {

            var user = props.currentUser;

            if(props.clientId !== undefined){
                user = { id: props.clientId }
            }
            props.sendReservation(props.reservation, user);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <div className="background">
            <Container style={{ padding: "25px", paddingTop: "80px", minHeight: "800px" }}>
                <Paper elevation={3} style={{ backgroundColor: "rgba(255, 255, 255, 0.75)", backdropFilter: "blur(12px)" }}>
                    <Grid>
                        <Box sx={{ width: "100%" }}>
                            <Stepper activeStep={activeStep}>
                                {steps.map((label, index) => {
                                    const stepProps = {};
                                    const labelProps = {};
                                    if (isStepOptional(index)) {
                                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                                    }
                                    if (isStepSkipped(index)) {
                                        stepProps.completed = false;
                                    }
                                    return (
                                        <Step key={label} {...stepProps}>
                                            <StepLabel {...labelProps}>{label}</StepLabel>
                                        </Step>
                                    );
                                })}
                            </Stepper>
                            {activeStep === steps.length ? (
                                <React.Fragment>
                                    <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you&apos;re finished</Typography>
                                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                        <Box sx={{ flex: "1 1 auto" }} />
                                        <Button onClick={handleReset}>Reset</Button>
                                    </Box>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    {activeStep == 0 && <ReserveRoomFirstPage />}
                                    {activeStep == 1 && <ReserveRoomSecondPage />}
                                    {activeStep == 2 && <ReserveRoomThirdPage />}

                                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                                        <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                            style={{ backgroundColor: "white" }}
                                            variant="outlined"
                                        >
                                            Back
                                        </Button>
                                        <Box sx={{ flex: "1 1 auto" }} />
                                        {isStepOptional(activeStep) && (
                                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }} variant="outlined" style={{ backgroundColor: "white" }}>
                                                Skip
                                            </Button>
                                        )}

                                        <Button onClick={handleNext} variant="outlined" style={{ backgroundColor: "white" }}>
                                            {activeStep === steps.length - 1 ? "Finish" : "Next"}
                                        </Button>
                                    </Box>
                                </React.Fragment>
                            )}
                        </Box>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
};

const mapStateToProps = (state, ownProps) => ({
    reservation: reservationsSelector.getReservation(state),
    currentUser: authorizationSelector.getUser(state),
    clientId: reservationsSelector.getClientId(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    setNotification: (message) => dispatch(setNotification({ message: message, status: "error", show: true })),
    sendReservation: (reservation, user) => dispatch(reservationActions.sendReservation(reservation, user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ReserveRoom);
