import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = ApiClient(process.env.REACT_APP_API_URL + "api/Result");

let resultClient = getBaseClient(client);

export default resultClient;