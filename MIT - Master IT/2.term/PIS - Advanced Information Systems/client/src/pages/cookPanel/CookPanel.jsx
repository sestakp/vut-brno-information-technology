import { Grid, Paper } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect } from "react";
import { PieChart } from "react-minimal-pie-chart";
import { connect } from "react-redux";
import noteActions from "../../redux/notes/noteActions";
import noteSelector from "../../redux/notes/noteSelector";
import reservationActions from "../../redux/reservations/reservationActions";
import reservationsSelector from "../../redux/reservations/reservationSelector";
import authorizationSelector from "../../redux/authorization/authorizationSelector";
import { GiPerson } from "react-icons/gi";
import { FaChild } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CookPanel = (props) => {
    const navigate = useNavigate();
    useEffect(() => {
        props.getMealInfo();
        props.getReservations();
    }, []);

    useEffect(() => {
        if(props.currentUser.email === ""){
            navigate("/home")
        }
    },[props.currentUser])
    
    let currentDate = new Date()
    currentDate.setHours(0) //maybe timezone offset
    currentDate.setMinutes(0)
    currentDate.setSeconds(0)
    currentDate.setMilliseconds(0)
    
    let dateList = currentDate.toLocaleDateString('cs-CZ', { timeZone: 'Europe/Prague' }).split(". ")
    let currentDateFormatted = dateList[2]+"-"+("0" + dateList[1]).slice(-2)+"-"+("0" + dateList[0]).slice(-2)
    
    const currentReservations = props.reservations?.filter(r => r.endDate >= currentDateFormatted && r.startDate <= currentDateFormatted)

    console.log("all reservations: ", props.reservations)
    console.log("current reservations: ", currentReservations)
    return (
        <Container>
            <Paper>
                <h1>Cook panel</h1>
                <Grid container>
                    {[...Array(3)].map((e, i) => (
                        <Grid item md={4}>
                            <h2>{props.meals[i].date}</h2>
                            <Container>
                                <h3>Guests</h3>
                                <p>Total guests: {props.meals[i].adults + props.meals[i].children}</p>

                                {props.meals[i].adults + props.meals[i].children > 0 ? (
                                    <PieChart
                                        data={[
                                            { title: "Adults", value: props.meals[i].adults, color: "#174F86" },
                                            { title: "Children", value: props.meals[i].children, color: "#5078C8" },
                                        ]}
                                        label={({ dataEntry }) => dataEntry.title + " - " + dataEntry.value}
                                        labelStyle={{ fill: "white", fontSize: "6px" }}
                                    />
                                ) : (
                                    <PieChart data={[{ value: 1, color: "#bbb" }]} />
                                )}

                                <h3>Breakfasts</h3>
                                <p>Total breakfasts: {props.meals[i].normal + props.meals[i].vegan + props.meals[i].vegetarian}</p>
                                {props.meals[i].normal + props.meals[i].vegan + props.meals[i].vegetarian > 0 ? (
                                    <PieChart
                                        data={[
                                            { title: "Normal", value: props.meals[i].normal, color: "#174F86" },
                                            { title: "Vegan", value: props.meals[i].vegan, color: "#5078C8" },
                                            { title: "Vegetarian", value: props.meals[i].vegetarian, color: "#6E96E6" },
                                        ]}
                                        label={({ dataEntry }) => dataEntry.title + " - " + dataEntry.value}
                                        labelStyle={{ fill: "white", fontSize: "6px" }}
                                    />
                                ) : (
                                    <PieChart data={[{ value: 1, color: "#bbb" }]} />
                                )}
                            </Container>
                        </Grid>
                    ))}
                </Grid>

                <h2>Notes</h2>
                {currentReservations.map(reservation => {
                    var adultCount = 0;
                    var childCount = 0;
                    for(var i = 0; i < reservation.rooms.length; i++){
                        adultCount += reservation.rooms[i].numberOfAdults;
                        childCount += reservation.rooms[i].numberOfChilds;
                    }

                    if(reservation.cookNotes == ""){
                        return "";
                    }

                    return (
                    <Paper elevation={5} style={{margin: "10px", padding: "10px" }} key={"note_for_reservation_"+reservation.id}>
                    <Grid container style={{display: "flex", alignItems: "center"}}>
                        <h2>From {reservation.startDate} to {reservation.endDate}</h2>
                        {[...Array(adultCount)].map((e, i) => <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "30px"}} key={i}/>)}
                        {[...Array(childCount)].map((e, i) => <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "30px", marginLeft: "2.5px", marginRight: "2.5px"}} key={i}/>)}    
                        <p>{reservation.cookNotes}</p>
                    </Grid>
                    </Paper>
                )})
                }

            </Paper>
        </Container>
    );
};

const mapStateToProps = (state, ownProps) => ({
    meals: reservationsSelector.getMeals(state),
    reservations: reservationsSelector.getAll(state),    
    currentUser: authorizationSelector.getUser(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    getMealInfo: () => dispatch(reservationActions.getMealInfo()),
    getNotes: () => dispatch(noteActions.GetAll()),
    getReservations: () => dispatch(reservationActions.GetAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(CookPanel);
