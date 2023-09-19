import getBaseSelectors from "../base/SelectorBase";

let noteSelector = getBaseSelectors("notes");

noteSelector.getNewNote = (state) => state.notes.newNote

export default noteSelector;