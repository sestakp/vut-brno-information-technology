import React from 'react';
import { getClient } from './client';
import apiClient from "../../models/api/apiClient";


const ApiClient = <TModel>(baseUrl: string) : apiClient<TModel> =>{

    let client = getClient(baseUrl);
    return({
        async get(url:string, conf = {}) {
            return await client
                .get<Promise<TModel[]>>(url, conf)
                .then((response) => Promise.resolve(response))
                .catch((error: object) => Promise.reject(error));
        },
    
        delete(url:string, conf = {}) {
            return client
                .delete(url, conf)
                .then((response) => Promise.resolve(response))
                .catch((error: object) => Promise.reject(error));
        },
    
        head(url:string, conf = {}) {
            return client
                .head(url, conf)
                .then((response) => Promise.resolve(response))
                .catch((error: object) => Promise.reject(error));
        },
    
        options(url:string, conf = {}) {
            return client
                .options(url, conf)
                .then((response) => Promise.resolve(response))
                .catch((error: object) => Promise.reject(error));
        },
    
        post(url:string, data = {}, conf = {}) {
            return client
                .post(url, data, conf)
                .then((response) => Promise.resolve(response))
                .catch((error: object) => Promise.reject(error));
        },
    
        put(url:string, data = {}, conf = {}) {
            return client
                .put(url, data, conf)
                .then((response) => Promise.resolve(response))
                .catch((error: object) => Promise.reject(error));
        },
    
        patch(url:string, data = {}, conf = {}) {
            return client
                .patch(url, data, conf)
                .then((response) => Promise.resolve(response))
                .catch((error: object) => Promise.reject(error));
        }
    });
}

export { ApiClient };
