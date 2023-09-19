import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/reservations");

let reservationsClient = getBaseClient(client);


reservationsClient.getReservationsByUserId = async (userId) => {
    return await client.get("getReservationsByUserId", {
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            userId
        }
    });
}

reservationsClient.getMealInfo = async(params) => {
    return await client.get("getMealInfo", { params });
}

reservationsClient.getTakenParkingSlots = async(startDate, endDate) => {
    return await client.get("getTakenParkingSlots", {
        headers: {
            'Content-Type': 'application/json'
        },
        params:{
            startDate,
            endDate
        }
    });
}



export default reservationsClient;