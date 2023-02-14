/**
 * Author: Pavel Šesták
 */
import { notificationTypes } from './notificationTypes';

export const setNotification = (message) => {
    return {
        type: notificationTypes.SET_NOTIFICATION,
        payload: message,
    };
};
