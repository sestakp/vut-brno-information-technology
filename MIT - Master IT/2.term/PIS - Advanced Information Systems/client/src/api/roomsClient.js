import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/rooms");

let roomsClient = getBaseClient(client);


roomsClient.getAvailableRooms = async (startDate,endDate) => {
    return await client.get("getAvailableRooms", {
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            startDate,
            endDate
        }
    });
}
export default roomsClient;