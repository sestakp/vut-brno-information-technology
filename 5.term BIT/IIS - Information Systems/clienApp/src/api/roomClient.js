/**
 * Author: Vojtěch Kulíšek
 */
import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/rooms");

let roomClient = getBaseClient(client);

export default roomClient;