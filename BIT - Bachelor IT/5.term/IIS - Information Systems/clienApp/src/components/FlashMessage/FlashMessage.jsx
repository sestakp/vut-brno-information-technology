/**
 * Author: Pavel Šesták
 */
import { Transition } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/notifications/notificationActions';
import { getNotification } from '../../redux/notifications/notificationSelectors';
import "./FlashMessage.css";

const FlashMessage = () => {
    const [show, setShow] = useState(false);
    const [icon, setIcon] = useState();
    const dispatch = useDispatch();
    const notification = useSelector(getNotification);

    const dispatchNotification = useCallback(() => {
        dispatch(
            setNotification({
                message: '',
                status: '',
                show: false,
            })
        );
    }, [dispatch]);

    function doubleClearTimeout(timer0, timer1){
        clearTimeout(timer0);
        clearTimeout(timer1);
    }

    useEffect(() => {
        if (notification.show) {
            setShow(notification.show);
            setIcon(getIcon(notification.status));
            var timer2;
            const timer = setTimeout(() => {
                timer2 = setTimeout(() => {
                    dispatchNotification();
                }, 200);
                setShow(false);
            }, 2000);
            return () => doubleClearTimeout(timer, timer2)
        }
    }, [notification, dispatchNotification]);

    const getIcon = (status) => {
        switch (status) {
            case 'FAIL':
                return (
                    <svg
                        className="w-6 h-6 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            case 'SUCCESS':
                return (
                    <svg
                        className="w-6 h-6 text-green-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                );

            case 'WARNING':
                return (
                    <svg
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="absolute" style={{zIndex: "9999"}}>
            <Transition
                show={show}
                enter="ease-out duration-500 transition"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed flex items-end justify-center w-full px-4 py-6 pointer-events-none top-5 right-2 sm:p-6 sm:items-start sm:justify-end" style={{zIndex: "2999"}}>
                    <div className="w-full max-w-sm overflow-hidden bg-white-no-important dark:bg-neutral-700 rounded-lg shadow-lg flash-message-shadow pointer-events-auto ring-1 ring-black ring-opacity-5">
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">{icon}</div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium leading-5 text-gray-900 dark:text-gray-200" style={{margin: "0"}}>
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default FlashMessage;
