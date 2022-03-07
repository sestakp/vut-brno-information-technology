import getFormData from "../libraries/formData";

export default function getBaseClient(client){
    return ({
        async getAll(){
            return await client.get();
        },
    
        async getById(payload){
            const params = {
                id: payload
            };
            return await client.get('', { params });
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
            return await client.delete('', payload);
        },
    })
}