/**
 * Author: Lukáš Plevač
 */
import { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import userClient from '../../api/userClient';
import ButtonForm from '../../components/ButtonForm/ButtonForm';
import HeaderForm from '../../components/HeaderForm/HeaderForm';
import InputForm from '../../components/InputForm/InputForm';
import { getRoute } from '../../routes/routes';
import userActions from "../../redux/users/userActions";
import { useDispatch } from 'react-redux';
import { get } from 'react-hook-form';

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const hasErrors = useRef(false);
    const history = useHistory();

    const login = async (e) => {
        e.preventDefault();
        setErrors({ email: [], password: [] });
        hasErrors.current = false;
        setIsLoading(true);
        try {
            let emailError = [];
            let passwordError = [];
            if(email === ""){
                
                emailError = ["Email is required"]
            }
            
            if(password === ""){
                passwordError = ["Password is required"]
            }


            if(emailError.length !== 0 || passwordError.length !== 0){
                hasErrors.current = true;
                setErrors({email: emailError, password: passwordError})
                return;
            }

            if (email.trim() && password.trim()) {
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
                setErrors({ email: ['Too many request! Try again Later'] });
            } else if (status === 500) {
                setErrors({
                    email: ['Impossible to reach the server! Try again later'],
                });
            }
        } 
        finally {

            setIsLoading(false);
            if (!hasErrors.current) {
                history.push(getRoute('home').path);
            }
        }
    };

    return (
        <>
            <HeaderForm
                title="Sign in to your account"
                subTitle="Create a new one"
                link={getRoute('register').path}
            />
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white-no-important shadow dark:bg-neutral-700 sm:rounded-lg sm:px-10">
                    <form onSubmit={login} className="space-y-6">
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
                            placeholder="password"
                            handleValue={setPassword}
                            error={
                                errors && errors.password
                                    ? errors.password[0]
                                    : undefined
                            }
                        />
                        <div className="flex justify-end">
                            <div className="text-sm">
                                <Link
                                    to={getRoute('forgot-password').path}
                                    className="font-medium text-primary-600 hover:text-primary-500"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                        <ButtonForm isLoading={isLoading} onClick={(e) => login(e)} full>
                            <span>Login</span>
                        </ButtonForm>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
