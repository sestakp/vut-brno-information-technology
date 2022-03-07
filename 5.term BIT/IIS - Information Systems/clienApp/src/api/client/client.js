/**
 * Author: Pavel Šesták
 */
import axios from 'axios';

const getClient = (baseURL) => {
    const options = {
        baseURL: baseURL,
        withCredentials: true,
        headers: {
            Accept: 'application/json',
        },
    };

    let client = axios.create(options);

    const handleResponse = (response) => {
        return Promise.resolve(response);
    };

    const handleError = (error) => {
        return Promise.reject({
            errors: [error],
        })
    };

    client.interceptors.response.use(handleResponse, handleError);

    return client;
};

export { getClient };
