import getBaseSelectors from "../base/SelectorBase";

let userSelector = getBaseSelectors("users");

userSelector.getUser = (state) => state.users.user;
userSelector.getUsers = (state) => state.users.users;
userSelector.getRegistration = (state) => state.users.registration;
userSelector.getReservations = (state) => state.users.reservations;


export default userSelector;