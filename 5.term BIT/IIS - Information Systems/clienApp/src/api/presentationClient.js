/**
 * Author: Pavel Šesták
 */
import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/presentations");

let presentationClient = getBaseClient(client);

export default presentationClient;