import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "Slot");

let slotClient = getBaseClient(client);

export default slotClient;