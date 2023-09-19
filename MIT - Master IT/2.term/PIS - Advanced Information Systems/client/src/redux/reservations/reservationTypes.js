import getBaseTypes from "../base/TypeBase";

let reservationTypes = getBaseTypes("RESERVATION");


reservationTypes.SET_VALUE = "SET_VALUE_RESERVATION";
reservationTypes.RESET = "RESET_RESERVATION";
reservationTypes.SET_MEALS = "SET_MEALS";
reservationTypes.UPDATE_NOTE_FOR_RESERVATIONS = "UPDATE_NOTE_FOR_RESERVATIONS";
reservationTypes.SET_TAKEN_PARKING_SLOTS = "SET_TAKEN_PARKING_SLOTS";
reservationTypes.RES_RESET = "RES_RESET";
reservationTypes.SET_CLIENT_ID_FOR_RES = "SET_CLIIENT_ID_FOR_RES";

export default reservationTypes;
