import { Grid,Container, Paper, Avatar } from "@mui/material";
import ReviewPanel from "../../components/reviewPanel/ReviewPanel";
import hotel_img_home from "../../assets/hotel_img_home.jpg"
import "./home.css"
const Home = (props) => {
    return(
        <div style={{padding: "25px", paddingTop: "80px"}}>
            <Container>             
                    <Grid container spacing={2}>
                        <Grid item md={8}>
                            <img src={hotel_img_home} style={{width: "100%"}}/>
                        </Grid>
                        <Grid item md={4}>
                            
                            <p>Escape to the epitome of luxury and sophistication at Belmond - where timeless elegance meets contemporary comfort. Immerse yourself in a world of opulence and indulge in the finest amenities and services that are tailored to meet your every need. With breathtaking views and breathtaking surroundings, Belmond is the ultimate destination for those seeking a truly unforgettable experience. Whether you're looking to relax, explore, or simply escape, Belmond offers the perfect retreat. So why wait? Book your stay today and discover the true meaning of luxury and class at Belmond.</p>
                    
                        </Grid>
                    </Grid>

                    <ReviewPanel />

            </Container>

        </div>
    )
}

export default Home;