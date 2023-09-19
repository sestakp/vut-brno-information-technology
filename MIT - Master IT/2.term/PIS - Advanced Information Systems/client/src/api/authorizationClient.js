import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";
import getFormData from '../utils/helpers/transformToFormData';
import axios from 'axios';

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/authorization");

let authorizationClient = getBaseClient(client);

authorizationClient.login = async(payload) => {
    let data = getFormData(payload);
    var credentials = btoa(payload.name + ':' + payload.password);
    var basicAuth = 'Basic ' + credentials;

    //client.defaults.headers.common['Authorization'] = basicAuth;


    return await client.post('login', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': basicAuth
        },
    });

}

export default authorizationClient;