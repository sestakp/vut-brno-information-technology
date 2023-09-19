import ReviewPaper from "../reviewPaper/ReviewPaper"
import Carousel from "react-material-ui-carousel";
import reviewSelector from "../../redux/reviews/reviewSelector";
import { connect } from "react-redux";
import reviewActions from "../../redux/reviews/reviewActions";
import { useEffect } from "react";

const ReviewPanel = (props) => {

    useEffect(() => {
        props.getReviews()
    },[])
    let reviews = []

    for(var i = 0; i < props.reviews.length; i = i + 3){
        var rev1 = props.reviews[i % props.reviews.length];
        var rev2 = props.reviews[i % (props.reviews.length) + 1];
        var rev3 = props.reviews[i % (props.reviews.length) + 2]; 
        reviews.push(
            <div style={{display: "flex"}} key={i}>
                <ReviewPaper review={rev1} />
                <ReviewPaper review={rev2} />
                <ReviewPaper review={rev3} />
            </div>
        )
    }

    return(
        <div style={{marginTop: "50px", marginBottom: "50px"}}>
            <Carousel style={{overflow: "revert"}}>
                {reviews}
            </Carousel>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => ({
    reviews: reviewSelector.getReviews(state),
    });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    getReviews: () => dispatch(reviewActions.getReviews())
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(ReviewPanel);