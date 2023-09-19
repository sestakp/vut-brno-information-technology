import getBaseClient from "./baseClient";
import { ApiClient } from "./client/apiClient";

const client = new ApiClient(process.env.REACT_APP_API_URL + "api/employees");

let employeesClient = getBaseClient(client);

employeesClient.init = async(params) => {
    return await client.get("init", { params });
}

export default employeesClient;
