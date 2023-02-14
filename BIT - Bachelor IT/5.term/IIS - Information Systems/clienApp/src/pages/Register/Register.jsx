/**
 * Author: Lukáš Plevač
 */
import { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userClient from '../../api/userClient';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import HeaderForm from '../../components/HeaderForm/HeaderForm';
import InputForm from '../../components/InputForm/InputForm';
import { getRoute } from '../../routes/routes';
import userActions from "../../redux/users/userActions";
import { useDispatch } from 'react-redux';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState();
    const hasErrors = useRef(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const register = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        hasErrors.current = false;
        setErrors({ email: [], name: [], password: [] });
        try {
            let nameError = [];
            let emailError = [];
            let passwordError = [];
            if(email === ""){
                emailError = ["Email is required"]
            }
            
            if(password === ""){
                passwordError = ["Password is required"]
            }

            if(name === ""){
                nameError = ["Name is required"]
            }


            if(emailError.length !== 0 || passwordError.length !== 0 || nameError.length !== 0){
                hasErrors.current = true;
                setErrors({email: emailError, password: passwordError, name: nameError})
                return;
            }
            if (email.trim() && password.trim() && name.trim()) {
                await userClient.registerUser({
                    name: name,
                    email: email,
                    password: password,
                    password_confirmation: passwordConfirmation,
                });
                await userClient.login({
                    email: email,
                    password: password,
                });
                dispatch(userActions.getAuthUser());

            }
        } catch ({ errors, status }) {
            hasErrors.current = true;
            if (errors[0].request.status === 422) {
                setErrors(errors[0].response.data.errors);
            } else if (status === 429) {
                setErrors({
                    email: ['Too many request! Try again Later'],
                    name: [],
                    password: [],
                });
            } else {
                setErrors({
                    email: ['Impossible to reach the server! Try again later'],
                    name: [],
                    password: [],
                });
            }
        } finally {
            setIsLoading(false);
            if (!hasErrors.current) {
                history.push(getRoute('home').path);
            }
        }
    };

    return (
        <>
            <HeaderForm
                title="Create your account"
                subTitle="Log in with an existing account"
                link={getRoute('login').path}
            />
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white-no-important shadow dark:bg-neutral-700 sm:rounded-lg sm:px-10">
                    <form onSubmit={register} className="space-y-6">
                        <InputForm
                            label="name"
                            name="name"
                            type="text"
                            value={name}
                            placeholder="John Doe"
                            handleValue={setName}
                            error={
                                errors && errors.name
                                    ? errors.name[0]
                                    : undefined
                            }
                        />
                        <InputForm
                            label="email"
                            name="email"
                            type="email"
                            value={email}
                            placeholder="test@test.com"
                            handleValue={setEmail}
                            error={
                                errors && errors.email
                                    ? errors.email[0]
                                    : undefined
                            }
                        />
                        <InputForm
                            label="password"
                            name="password"
                            type="password"
                            value={password}
                            handleValue={setPassword}
                            error={
                                errors && errors.password
                                    ? errors.password[0]
                                    : undefined
                            }
                        />
                        <InputForm
                            label="Password Confirmation"
                            name="password_confirmation"
                            type="password"
                            value={passwordConfirmation}
                            handleValue={setPasswordConfirmation}
                        />
                        <ButtonForm isLoading={isLoading} full>
                            <span>Register</span>
                        </ButtonForm>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Register;
