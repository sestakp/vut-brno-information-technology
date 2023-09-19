
import getBaseTypes from "../base/TypeBase";

let userTypes = getBaseTypes("USER");

userTypes.SET_USER = 'SET_USER';
userTypes.SET_REGISTRATION_PARAM = "SET_REGISTRATION_PARAM";
userTypes.UPDATE_USER_FIELD = "UPDATE_USER_FIELD";
userTypes.REMOVE_USER_RESERVATION = "REMOVE_USER_RESERVATION";
userTypes.USER_RESERVATIONS = "USER_RESERVATIONS";
userTypes.ADD_NOTE_TO_RESERVATION = "ADD_NOTE_TO_RESERVATION";
userTypes.USER_RESET = "USER_RESET"

export default userTypes;