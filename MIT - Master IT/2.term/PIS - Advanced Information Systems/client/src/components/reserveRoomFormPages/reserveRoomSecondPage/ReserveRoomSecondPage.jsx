import { Grid, Checkbox , TextField} from "@mui/material"
import TextareaAutosize from '@mui/base/TextareaAutosize';
import reservationsSelector from "../../../redux/reservations/reservationSelector";
import { connect } from "react-redux";
import reservationActions from "../../../redux/reservations/reservationActions";
import validator from "../../../utils/helpers/validators";
import parkingSlotLimits from "../../../utils/parkingSlotLimits";
import prices from "../../../utils/prices";
const ReserveRoomSecondPage = (props) => {

    let numberOfBreakfasts = Number(props.reservation.normalBreakfast) + Number(props.reservation.vegetarianBreakfast) + Number(props.reservation.veganBreakfast)
    let numberOfPeopels = props.reservation.numberOfAdults + props.reservation.numberOfChilds

   
    return(
        <div style={{padding: "25px"}}>
            <Grid container>
                <Grid item md={6}>
                    <div>
                        <h4>Parking space reservation</h4>
                        <p style={{lineHeight: 3}}><TextField error={validator.validateNonNegativeNumber(props.reservation.vipParking, parkingSlotLimits.vipParking - props.takenParkingSlots.vipParking)} helperText={validator.validateNonNegativeNumber(props.reservation.vipParking, parkingSlotLimits.vipParking - props.takenParkingSlots.vipParking)} variant="outlined" type="number" style={{width: 70, backgroundColor: "rgba(255,255,255,0.6)"}} size="small" value={props.reservation.vipParking} onChange={(e) => props.setVipParking(e.target.value)}/> VIP ({parkingSlotLimits.vipParking - props.takenParkingSlots.vipParking} free/1) ${prices.vipParking}</p>
                        <p style={{lineHeight: 3}}><TextField error={validator.validateNonNegativeNumber(props.reservation.outsideParking, parkingSlotLimits.outsideParking - props.takenParkingSlots.outsideParking)} helperText={validator.validateNonNegativeNumber(props.reservation.outsideParking, parkingSlotLimits.outsideParking - props.takenParkingSlots.outsideParking)} variant="outlined" type="number" style={{width: 70, backgroundColor: "rgba(255,255,255,0.6)"}} size="small" value={props.reservation.outsideParking} onChange={(e) => props.setOutsideParking(e.target.value)}/> Outside ({parkingSlotLimits.outsideParking - props.takenParkingSlots.outsideParking} free/10) ${prices.outsideParking}</p>
                        <p style={{lineHeight: 3}}><TextField error={validator.validateNonNegativeNumber(props.reservation.insideParking, parkingSlotLimits.insideParking - props.takenParkingSlots.insideParking)} helperText={validator.validateNonNegativeNumber(props.reservation.insideParking, parkingSlotLimits.insideParking - props.takenParkingSlots.insideParking)} variant="outlined" type="number" style={{width: 70, backgroundColor: "rgba(255,255,255,0.6)"}} size="small" value={props.reservation.insideParking} onChange={(e) => props.setInsideParking(e.target.value)} /> Inside ({parkingSlotLimits.insideParking - props.takenParkingSlots.insideParking} free/4) ${prices.insideParking}</p>
                    </div>

                </Grid>    
                <Grid item md={6}>
                    <div>
                        <h4>Order breakfast</h4>
                        <Grid container>
                            <Grid item md={6}>
                                <h4>Notes for the cook</h4>
                                <TextareaAutosize minRows={6} placeholder="alergies, etc.." value={props.reservation.cookNotes} onChange={(e) => props.setCookNotes(e.target.value)}/>
                            </Grid>
                            <Grid item md={6}>
                                <p style={{lineHeight: 3}}><TextField error={validator.validateNonNegativeNumber(numberOfBreakfasts, numberOfPeopels)} helperText={validator.validateNonNegativeNumber(numberOfBreakfasts, numberOfPeopels)} variant="outlined" type="number" style={{width: 70, backgroundColor: "rgba(255,255,255,0.6)"}} size="small" value={props.reservation.normalBreakfast} onChange={(e) => props.setNormalBreakfast(e.target.value)}/> Normal ${prices.normalBreakfast}</p>
                                <p style={{lineHeight: 3}}><TextField error={validator.validateNonNegativeNumber(numberOfBreakfasts, numberOfPeopels)} helperText={validator.validateNonNegativeNumber(numberOfBreakfasts, numberOfPeopels)} variant="outlined" type="number" style={{width: 70, backgroundColor: "rgba(255,255,255,0.6)"}} size="small" value={props.reservation.vegetarianBreakfast} onChange={(e) => props.setVegetarianBreakfast(e.target.value)}/> Vegetarian ${prices.vegetarianBreakfast}</p>
                                <p style={{lineHeight: 3}}><TextField error={validator.validateNonNegativeNumber(numberOfBreakfasts, numberOfPeopels)} helperText={validator.validateNonNegativeNumber(numberOfBreakfasts, numberOfPeopels)} variant="outlined" type="number" style={{width: 70, backgroundColor: "rgba(255,255,255,0.6)"}} size="small" value={props.reservation.veganBreakfast} onChange={(e) => props.setVeganBreakfast(e.target.value)}/> Vegan ${prices.veganBreakfast}</p>
                            </Grid>
                        </Grid>
                        
                    </div>
                </Grid> 
            </Grid>
        </div>
    )
}


const mapStateToProps = (state, ownProps) => ({
    reservation: reservationsSelector.getReservation(state),
    takenParkingSlots: reservationsSelector.getTakenParkingSlots(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({

    setStartDate: (date) => dispatch(reservationActions.setStartDate(date)),
    setVipParking: (numb) => dispatch(reservationActions.setVipParking(numb)),
    setOutsideParking: (numb) => dispatch(reservationActions.setOutsideParking(numb)),
    setInsideParking: (numb) => dispatch(reservationActions.setInsideParking(numb)),
    setCookNotes: (note) => dispatch(reservationActions.setCookNotes(note)),
    setNormalBreakfast: (numb) => dispatch(reservationActions.setNormalBreakfast(numb)),
    setVegetarianBreakfast: (numb) => dispatch(reservationActions.setVegetarianBreakfast(numb)),
    setVeganBreakfast: (numb) => dispatch(reservationActions.setVeganBreakfast(numb)),

});

export default connect(mapStateToProps, mapDispatchToProps)(ReserveRoomSecondPage);