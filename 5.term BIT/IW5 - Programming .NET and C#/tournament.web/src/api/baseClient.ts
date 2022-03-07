import getFormData from "../utils/formData";
import apiClient from "../models/api/apiClient";
import baseClient from "../models/api/baseClient";

export default function getBaseClient<TModel>(client:apiClient<TModel>):baseClient<TModel>{
    return ({
        async getAll(params){
            return await client.get("", {params});
        },
    
        async getById(payload){
            const params = {
                id: payload
            };
            return await client.get('GetById', { params });
        },
    
        async create(payload){
            let data = getFormData(payload);
            return await client.post('', data, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }});
        },
    
        async update(payload){
            let data = getFormData(payload);
            return await client.put('', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }});
        },    
        
        async delete(payload){
            return await client.delete('', {params: { id: payload.id }});
        },

        async getFormDefaultModel(){
            return await client.get('GetFormDefaultModel', {})
        }

    })
}