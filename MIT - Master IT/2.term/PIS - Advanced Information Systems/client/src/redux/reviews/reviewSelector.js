import getBaseSelectors from "../base/SelectorBase";

let reviewSelector = getBaseSelectors("reviews");

reviewSelector.getReviews = (state) => state.reviews.reviews;
reviewSelector.getUserReview = (state) => state.reviews.userReview;

export default reviewSelector;