import getBaseSelectors from "../base/SelectorBase";

let roomsSelector = getBaseSelectors("rooms");

roomsSelector.getRoomToAdd = (state) => state.rooms.roomToAdd;

export default roomsSelector;