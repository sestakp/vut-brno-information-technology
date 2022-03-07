import { ApiClient } from './client/apiClient';
import getBaseClient from "./baseClient";

const client = ApiClient(process.env.REACT_APP_API_URL + "api/Game");

let gameClient = getBaseClient(client);

export default gameClient;