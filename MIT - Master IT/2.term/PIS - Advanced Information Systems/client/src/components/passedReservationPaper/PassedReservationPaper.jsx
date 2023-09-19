import { Paper, Grid, Button } from "@mui/material"
import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import defaultImage from "../../assets/default-image.jpg"


const PassedReservationPaper = (props) => {

    return(
        <Paper elevation={5} style={{margin: "10px", padding: "10px" }}>
        
        <h2>From {props.reservation.startDate} to {props.reservation.endDate}</h2>
        {props.reservation.rooms?.map(room => (

            <Paper elevation={5}>
                <Grid container style={{margin: "10px"}}>
                    <Grid item md={4} style={{display: "flex", alignItems: "center"}}>
                        <img src={room.img === "null" || room.img === null || room.img === undefined ? defaultImage : room.img} style={{maxWidth: "100%"}}/>
                    </Grid>
                    <Grid item md={8} style={{padding: "10px"}}>
                        <h3>{room.title}
                        {[...Array(room.adultCount)].map((e, i) => <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "15px"}} key={i}/>)}
                        {[...Array(room.childCount)].map((e, i) => <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "10px", marginLeft: "2.5px", marginRight: "2.5px"}} key={i}/>)}    
                        
                        </h3>
                        <Grid container>
                            <p className="roomDescription">{room.description}</p>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        ))

        }
        
    </Paper>
    )
}

export default PassedReservationPaper