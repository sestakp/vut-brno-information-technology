import { ApiClient } from './client/apiClient';

const client = ApiClient(process.env.REACT_APP_API_URL + "api/Search");

const searchClient = {
    async getAll(params: object){
        return await client.get("Filter", {params});
    },
}

export default searchClient;