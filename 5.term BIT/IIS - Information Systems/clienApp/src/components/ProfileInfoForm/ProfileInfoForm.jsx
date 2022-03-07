/**
 * Author: Lukáš Plevač
 */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userClient from '../../api/userClient';
import ticketClient from '../../api/ticketClient';
import { setNotification } from '../../redux/notifications/notificationActions';
import userActions from '../../redux/users/userActions';
import userSelector from '../../redux/users/userSelector';
import ButtonForm from '../ButtonForm/ButtonForm';
import InputForm from '../InputForm/InputForm';

const ProfileInfoForm = () => {
    const user = useSelector(userSelector.getUser);
    const dispatch = useDispatch();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const updateProfile = async (e) => {
        setIsLoading(true);
        setErrors({ email: [], name: [] });
        e.preventDefault();
        try {
            if (user.name !== name || user.email !== email) {
                await userClient.updateUser({ name: name, email: email, role: user.role, old_email: user.email });
                dispatch(
                    setNotification({
                        message: 'Profile Saved',
                        status: 'SUCCESS',
                        show: true,
                    })
                );
                dispatch(
                    userActions.setCurrentUser({
                        email: email,
                        name: name,
                        role: user.role,
                        is_verified: false,
                    })
                );
            }
        } catch (error) {
            if (error.status === 422) {
                setErrors(error.errors);
            } else {
                dispatch(
                    setNotification({
                        message: 'Something went wrong try again later',
                        status: 'FAIL',
                        show: true,
                    })
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <section>
                <form onSubmit={updateProfile}>
                    <div className="shadow sm:rounded-md sm:overflow-hidden">
                        <div className="px-4 py-6 bg-white-no-important dark:bg-neutral-700 sm:p-6 text-neutral-900 dark:text-neutral-200">
                            <div>
                                <h2 className="text-lg font-medium leading-6">
                                    Profile Info <span className="badge bg-info">{user.role}</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-4 gap-6 mt-6">
                                <InputForm
                                    name="name"
                                    label="name"
                                    value={name}
                                    handleValue={setName}
                                    wrapperStyle="col-span-4 sm:col-span-2"
                                    error={
                                        errors && errors.name
                                            ? errors.name[0]
                                            : undefined
                                    }
                                />
                                <InputForm
                                    name="email"
                                    label="email"
                                    value={email}
                                    handleValue={setEmail}
                                    wrapperStyle="col-span-4 sm:col-span-2"
                                    error={
                                        errors && errors.email
                                            ? errors.email[0]
                                            : undefined
                                    }
                                />
                            </div>
                        </div>
                        <div className="flex justify-end px-4 py-3 bg-neutral-50 dark:bg-neutral-600 sm:px-6">
                            <ButtonForm isLoading={isLoading}>Save</ButtonForm>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default ProfileInfoForm;
