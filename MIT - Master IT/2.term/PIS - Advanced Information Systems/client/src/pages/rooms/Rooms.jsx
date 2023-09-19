import { Container } from "@mui/system"
import RoomPanel from "../../components/RoomPanel/RoomPanel"
import room1 from "../../assets/rooms/room1.jpg"
import room2 from "../../assets/rooms/room2.jpg"
import room3 from "../../assets/rooms/room3.jpg"
import room4 from "../../assets/rooms/room4.jpg"
import NewRoomPanel from "../../components/NewRoomPanel/NewRoomPanel"
import { connect } from "react-redux";
import roomsSelector from "../../redux/rooms/roomSelector"
import authorizationSelector from "../../redux/authorization/authorizationSelector";
import { useEffect } from "react"
import roomsAction from "../../redux/rooms/roomActions"
import { useNavigate } from "react-router-dom";

const Rooms = (props) => {

    const navigate = useNavigate();
    useEffect(() => {
        props.getRooms()
    },[])

    useEffect(() => {
        if(props.currentUser.email === ""){
            navigate("/home")
        }
    },[props.currentUser])

    return(
        <Container>
            <NewRoomPanel />

            {[...Array(...props.rooms)].map((room) =>
                <RoomPanel key={"room_id_"+room.id} id={room.id} services={room.services} adultCount={room.numberOfAdults} childCount={room.numberOfChilds} img={room.img} title={room.title} description={room.description} price={room.price}/>                
            )}
        </Container>
    )
}

const mapStateToProps = (state, ownProps) => ({
    rooms: roomsSelector.getAll(state),
    currentUser: authorizationSelector.getUser(state),
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    getRooms: () => dispatch(roomsAction.GetAll())
  });
  
  export default connect(mapStateToProps, mapDispatchToProps)(Rooms);