/**
 * Author: Vojtěch Kulíšek
 */
import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/tickets");

let ticketClient = getBaseClient(client);
ticketClient.getVisitors = async (params) => {
    return await client.get('getVisitors', { params });
}

export default ticketClient;