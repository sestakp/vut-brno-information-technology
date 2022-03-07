/**
 * Author: Lukáš Plevač
 */
import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/conferences");

let conferenceClient = getBaseClient(client);

export default conferenceClient;