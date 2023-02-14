import axios from 'axios';

const getClient = (baseURL) => {
    const options = {
        baseURL: baseURL,
        headers: {
            Accept: 'application/json',
        },
    };

    let client = axios.create(options);

    const handleResponse = (response) => {
        return Promise.resolve(response);
    };

    const handleError = (error) => {
        if (error.response.status === 422) {
            return Promise.reject({
                status: error.response.status,
                errors: error.response.data.errors,
            });
        } else {
            return Promise.reject({
                status: error.response.status,
                message: error.response.data.message,
            });
        }
    };

    client.interceptors.response.use(handleResponse, handleError);

    return client;
};

export { getClient };
