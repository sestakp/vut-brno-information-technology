/**
 * Author: Lukáš Plevač
 */
import PresentationTypes from "./presentationTypes";
import getBaseActions from "../ActionBase";
import presentationClient from "../../api/presentationClient";

let PresentationActions = getBaseActions(PresentationTypes, presentationClient, "Presentation");


export default PresentationActions;
