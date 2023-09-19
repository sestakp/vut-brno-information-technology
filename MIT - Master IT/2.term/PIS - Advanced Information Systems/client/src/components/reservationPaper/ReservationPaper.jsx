import { Paper, Grid, Button } from "@mui/material"
import { FaChild } from 'react-icons/fa';
import { GiPerson } from 'react-icons/gi';
import defaultImage from "../../assets/default-image.jpg"

const ReservationPaper = (props) => {
    
    return (
            <Paper elevation={5} style={{margin: "10px" }}>

                <Grid container>
                    <Grid item md={4} style={{display: "flex", alignItems: "center"}}>
                        <img src={props.img === "null" || props.img === null || props.img === undefined ? defaultImage : props.img} style={{maxWidth: "100%"}}/>
                    </Grid>
                    <Grid item md={8} style={{padding: "10px"}}>
                        <h3>{props.title}
                        {[...Array(props.adultCount)].map((e, i) => <GiPerson style={{color: "rgb(23, 79, 134)", fontSize: "15px"}} key={i}/>)}
                        {[...Array(props.childCount)].map((e, i) => <FaChild style={{color: "rgb(23, 79, 134)", fontSize: "10px", marginLeft: "2.5px", marginRight: "2.5px"}} key={i}/>)}    
                        <span>23.02.2023 - 27.02.2023</span>
                        </h3>
                        <Grid container>
                            <Grid item md={8}>
                                <p className="roomDescription">{props.description}</p>
                            </Grid>
                            <Grid item md={4}>
                                <Button variant="outlined">Cancel reservation</Button>
                            </Grid>
                        </Grid>
                        

                        
                    </Grid>

                </Grid>
            </Paper>
    )

}

export default ReservationPaper