import PaidIcon from "@mui/icons-material/Paid";
import PaymentIcon from "@mui/icons-material/Payment";
import { Grid, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import { Container } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect } from "react";
import { connect } from "react-redux";
import reservationAction from "../../redux/reservations/reservationActions";
import reservationSelector from "../../redux/reservations/reservationSelector";
import authorizationSelector from "../../redux/authorization/authorizationSelector";
import getReservationSumPrice from "../../utils/helpers/getReservationSumPrice";
import parkingSlotLimits from "../../utils/parkingSlotLimits";
import { useNavigate } from "react-router-dom";

const Receptionist = (props) => {
    
    const navigate = useNavigate();

    useEffect(() => {
        props.getReservation();
        props.getTakenParkingSlots();
    }, []);

    useEffect(() => {
        if(props.currentUser.email === ""){
            navigate("/home")
        }
    },[props.currentUser])


    console.log(props.takenParkingSlots);

    const columns = [
        {
            field: "user",
            headerName: "User",
            width: 150,
            editable: false,
            sortable: true,
            valueGetter: (params) => params.row.user.name,
        },
        {
            field: "rooms",
            headerName: "Rooms",
            width: 80,
            type: "number",
            editable: false,
            sortable: true,
            valueGetter: (params) => params.row.rooms.length,
        },
        {
            field: "insideParking",
            headerName: "Inside Parking",
            width: 110,
            type: "number",
            editable: false,
            sortable: true,
        },
        {
            field: "outsideParking",
            headerName: "Outside Parking",
            width: 120,
            type: "number",
            editable: false,
            sortable: true,
        },
        {
            field: "vipParking",
            headerName: "VIP Parking",
            width: 100,
            type: "number",
            editable: false,
            sortable: true,
        },
        {
            field: "normalBreakfast",
            headerName: "Normal Breakfast",
            width: 130,
            type: "number",
            editable: false,
            sortable: true,
        },
        {
            field: "veganBreakfast",
            headerName: "Vegan Breakfast",
            width: 120,
            type: "number",
            editable: false,
            sortable: true,
        },
        {
            field: "vegetarianBreakfast",
            headerName: "Vegetarian Breakfast",
            width: 150,
            type: "number",
            editable: false,
            sortable: true,
        },
        {
            field: "sum",
            headerName: "Price",
            width: 80,
            editable: false,
            sortable: true,
            valueGetter: (params) =>
                getReservationSumPrice(params.row).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                }),
        },

        {
            cellClassName: "actions",
            headerName: "Pay",
            width: 80,
            editable: false,
            sortable: false,
            filterable: false,
            renderCell: (params) => {
                if (params.row.paid) {
                    return <PaidIcon color="inherit" />;
                }

                return (
                    <Button onClick={() => props.payReservation(params.row.id)}>
                        <PaymentIcon color="inherit" />
                    </Button>
                );
            },
        },
    ];

    return (
        <Container>
            <Paper>
                <h1>Receptionist panel</h1>
                <div style={{ height: "50vh", width: "100%" }}>
                    <DataGrid disableRowSelectionOnClick rows={props.reservations} columns={columns} />
                </div>
            </Paper>

            <h1>Free parking slots</h1>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={2} sm={4} md={4}>
                    <h3>Vip parkign : {parkingSlotLimits.vipParking - props.takenParkingSlots.vipParking}</h3>
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    <h3>Inside Parking : {parkingSlotLimits.insideParking - props.takenParkingSlots.outsideParking}</h3>
                </Grid>
                <Grid item xs={2} sm={4} md={4}>
                    <h3>Outside Parking : {parkingSlotLimits.outsideParking - props.takenParkingSlots.outsideParking}</h3>
                </Grid>
            </Grid>
        </Container>
    );
};

const mapStateToProps = (state, ownProps) => {
    return {
        reservations: reservationSelector.getAll(state),
        currentUser: authorizationSelector.getUser(state),
        takenParkingSlots: reservationSelector.getTakenParkingSlots(state),
    };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
    getReservation: () => dispatch(reservationAction.GetAll()),
    getTakenParkingSlots: () => dispatch(reservationAction.getTakenParkingSlots(Date.now(), Date.now())),
    payReservation: (reservationId) => dispatch(reservationAction.updateField(reservationId, "paid", true)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Receptionist);
