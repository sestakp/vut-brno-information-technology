/**
 * Author: Vojtěch Kulíšek
 */
import ConferenceTypes from "./conferenceTypes";
import getBaseActions from "../ActionBase";
import conferenceClient from "../../api/conferenceClient";

let ConferenceActions = getBaseActions(ConferenceTypes, conferenceClient, "Conference");

export default ConferenceActions;
