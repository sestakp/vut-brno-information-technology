import { Paper, Avatar, Rating } from "@mui/material"


const ReviewPaper = (props) => {
    if(props.review == undefined){
        return ""
    }

    return(
        <Paper style={{width: "33%", margin: "5px", padding: "10px"}} elevation={5}>
            <div style={{display: "flex", alignItems: "center"}}>
                <Avatar alt={props.review.user.name} src={props.review.user.avatar} style={{marginRight: "10px"}}/>
                <h2>{props.review.user.name}</h2> 
            </div>
            <p>{props.review.text}</p>
            <Rating name="read-only" value={props.review.rating} readOnly style={{margin: "auto"}}/>
        </Paper>
    )
}

export default ReviewPaper