import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/reviews");

let reviewClient = getBaseClient(client);

reviewClient.getByUserId = async(payload) =>{
    return await client.get('/getByUserId/'+payload);
}

export default reviewClient;