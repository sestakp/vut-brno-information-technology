/**
 * Author: Vojtěch Kulíšek
 */
import { ApiClient } from './client/apiClient';

let client = new ApiClient(process.env.REACT_APP_API_URL);

const userClient = {
    async login(payload) {
        await client.get('/sanctum/csrf-cookie');
        await client.post('/login', payload);
    },
    async logout() {
        return await client.post('/logout');
    },
    async forgotPassword(payload) {
        await client.get('/sanctum/csrf-cookie');
        await client.post('/forgot-password', payload);
    },
    async getAuthUser() {
        return await client.get('api/user');
    },
    async resetPassword(payload) {
        await client.get('/sanctum/csrf-cookie');
        await client.post('/reset-password', payload);
    },
    async updatePassword(payload) {
        await client.put('/user/password', payload);
    },
    async registerUser(payload) {
        await client.get('/sanctum/csrf-cookie');
        await client.post('/register', payload);
    },
    async sendVerification(payload) {
        await client.post('/email/verification-notification', payload);
    },
    async updateUser(payload) {
        await client.put('/api/users', payload);
    },
    async getAllUsers(){
        await client.get('/sanctum/csrf-cookie');
        return await client.get('/api/users');
    },
    async registerGuestAccount(payload){
        return await client.post('/api/users/registerGuestAccount', payload);
    },
    async deleteUser(payload){
        let data = new FormData();
        data.append("_method", "DELETE"); 
        return await client.post('/api/users',data, {params: { id: payload}});
    }
};

export default userClient;
