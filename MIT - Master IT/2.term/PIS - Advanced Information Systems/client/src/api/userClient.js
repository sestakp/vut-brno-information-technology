import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";
import getFormData from '../utils/helpers/transformToFormData';
import { imageUrlToBase64 } from '../utils/helpers/imageUrlToBase64';

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/users/");

let usersClient = getBaseClient(client);


usersClient.register = async(payload) => {

    payload.avatar = await imageUrlToBase64(payload.avatar)
    let data = getFormData(payload);
    return await client.post('', data, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
    });
}

export default usersClient;