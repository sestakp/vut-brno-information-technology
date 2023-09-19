import { imageUrlToBase64 } from "../utils/helpers/imageUrlToBase64";
import getFormData from "../utils/helpers/transformToFormData";

function getBaseClient(client){
    return ({
        async getAll(params){
            return await client.get("", { params });
        },
    
        async getById(payload){
            return await client.get('/'+payload);
        },
    
        async create(payload){
            payload.img = await imageUrlToBase64(payload.img)
            let data = getFormData(payload);
            return await client.post('', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
        },

        async updateField(payload){
            if(payload.fieldName == "img" && payload.value !== null){
                if(payload.img == undefined){
                    payload.img = payload.value
                }    
                payload.value = await imageUrlToBase64(payload.img)
            }
            payload = {
                id: payload.id,
                [payload.fieldName]: payload.value
            }
            
            let data = getFormData(payload);
            
            return await client.patch('', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
        },
    
        async update(payload){
            
            payload.img = await imageUrlToBase64(payload.img)
            let data = getFormData(payload);

            return await client.put('', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }});
        },    
        
        async delete(id){
            return await client.delete("/"+id);
        },
    })
}

export default getBaseClient;