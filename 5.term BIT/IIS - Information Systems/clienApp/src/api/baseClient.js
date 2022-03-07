/**
 * Author: Vojtěch Kulíšek
 */
import getFormData from "../utils/helpers/transformToFormData";

function getBaseClient(client){
    return ({
        async getAll(params){
            return await client.get("", { params });
        },
    
        async getById(payload){
            const params = {
                id: payload
            };
            return await client.get('getById', { params });
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
            //Laravel cannot read formdata when method is put, then send like post and set _method to PUT
            data.append("_method", "PUT");
            return await client.post('', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }});
        },    
        
        async delete(payload){
            let data = new FormData();
            data.append("_method", "DELETE");
            return await client.post('',data, {params: { id: payload.id}});
        },
    })
}

export default getBaseClient;