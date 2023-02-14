/**
 * Author: Lukáš Plevač
 */
import { userTypes } from './userTypes';
import usersClient from '../../api/userClient';
import { setNotification } from '../notifications/notificationActions';

const userActions = {
    getAllUsers: () => async(dispatch) => {
        const response = await usersClient.getAllUsers();
        dispatch({
            type: userTypes.SET_USERS,
            payload: response.data,
        })
    },
    setCurrentUser: (user) => ({
            type: userTypes.SET_USER,
            payload: user,
    }),
    unsetCurrentUser: () => ({
            type: userTypes.SET_USER,
            payload: {
                id: -1,
                name: "",
                role: "guest",
                is_verified: false,
                is_github_account: false,
            }
    }),
    getAuthUser: () => async (dispatch) => {
        try {
            const response = await usersClient.getAuthUser();
            dispatch(userActions.setCurrentUser(response.data));
            return Promise.resolve(response);
        } catch (errors) {
            console.warn("Get Auth User error");
            dispatch(userActions.unsetCurrentUser());
        }
    },
    logout: () => async (dispatch) => {
        try {
            const response = await usersClient.logout();
            dispatch(userActions.unsetCurrentUser());
            return Promise.resolve(response);
        } catch (errors) {
            return Promise.resolve(errors);
        }
    },
    deleteUser: (user) => async(dispatch) => {
        try{
            const response = await usersClient.deleteUser(user.id);
            dispatch({
                type: userTypes.DEL_USER,
                payload: user,
            })

            dispatch(
                setNotification({
                  message: user.name + " account was succesfully deleted",
                  status: 'FAIL',
                  show: true,
                })
                )
            return response.data;
        }
        catch(e){
        }
    },
}

export default userActions;
