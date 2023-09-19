import { Grid, Paper, Button } from "@mui/material";
import { connect } from "react-redux";
import noteActions from "../../redux/notes/noteActions";
import defaultImage from "../../assets/default-image.jpg"


const CleanerNotePaper = (props) => {

    if(props.room?.notes === undefined || props.room?.notes.length == 0){
        return "";
    }

    return(
        <Paper elevation={5} style={{margin: "10px", padding: "10px" }}>
        
          
        <Grid container>

            <Grid item md={4} style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
                <h2>{props.room.title}</h2>
                <img src={props.room.img === "null" || props.room.img === null || props.room.img === undefined ? defaultImage : props.room.img} style={{maxWidth: "100%"}}/>
            </Grid>
            <Grid item md={8}>
            <Grid container style={{overflowY: "scroll", height: "320px"}}>
            {props.room?.notes?.map((note, index) => (
            <Grid item md={6}>
                <Paper elevation={5} style={{margin: "10px"}}>
                    <Grid container style={{margin: "10px"}}>
                        <Grid item md={12} style={{padding: "10px"}}>
                            <Grid container>
                                    <p>{note.text}</p>
                            </Grid>
                            <Grid container>
                                <Button variant={note.state === "SOLVED" ? "contained" : "outlined"} color={note.state === "SOLVED" ? "success" : "inherit"} style={{margin: "5px"}} onClick={() => props.updateState("SOLVED", note.id)}>SOLVED</Button>
                                <Button variant={note.state === "PENDING" ? "contained" : "outlined"} color={note.state === "PENDING" ? "primary" : "inherit"} style={{margin: "5px"}} onClick={() => props.updateState("PENDING", note.id)}>PENDING</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            ))

            }
            </Grid>
            </Grid>
        
        </Grid>
    </Paper>)
}


const mapStateToProps = (state, ownProps) => ({
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    updateState: (newState, noteId) => dispatch(noteActions.updateField(noteId, "state", newState)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(CleanerNotePaper);