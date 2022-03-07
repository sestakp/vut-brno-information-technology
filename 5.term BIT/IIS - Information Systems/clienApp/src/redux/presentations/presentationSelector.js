/**
 * Author: Lukáš Plevač
 */
import getBaseSelectors from "../SelectorBase";

let PresentationSelector = getBaseSelectors("presentation");
PresentationSelector.getPresentationsByUser = (state, user_id) => state.presentation.records.filter(x => x.user_id === user_id);
export default PresentationSelector;