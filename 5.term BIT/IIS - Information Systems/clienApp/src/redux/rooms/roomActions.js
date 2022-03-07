/**
 * Author: Vojtěch Kulíšek
 */
import roomTypes from "./roomTypes";
import getBaseActions from "../ActionBase";
import roomClient from "../../api/roomClient";

let RoomActions = getBaseActions(roomTypes, roomClient, "Room");


export default RoomActions;
