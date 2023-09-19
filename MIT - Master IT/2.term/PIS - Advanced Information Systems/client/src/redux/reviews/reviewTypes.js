import getBaseTypes from "../base/TypeBase";

let reviewTypes = getBaseTypes("REVIEWS");

reviewTypes.SET_REVIEWS = "SET_REVIEWS";
reviewTypes.SET_USER_REVIEW = "SET_USER_REVIEW";
reviewTypes.SET_FIELD_USER_REVIEW = "SET_FIELD_USER_REVIEW";
reviewTypes.REV_RESET = "REV_RESET";

export default reviewTypes;
