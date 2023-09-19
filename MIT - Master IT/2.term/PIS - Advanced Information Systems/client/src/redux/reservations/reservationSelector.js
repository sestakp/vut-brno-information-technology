import getBaseSelectors from "../base/SelectorBase";

let reservationsSelector = getBaseSelectors("reservations");

reservationsSelector.getReservation = (state) => state.reservations.newReservation;

reservationsSelector.isRoomSelected = (state, id) => state.reservations.newReservation.selectedRooms.filter(r => r === id ).length !== 0

reservationsSelector.getMeals = (state) => state.reservations.meals;

reservationsSelector.getTakenParkingSlots = (state) => state.reservations.takenParkingSlots;
reservationsSelector.getClientId = (state) => state.reservations.clientId;



export default reservationsSelector;