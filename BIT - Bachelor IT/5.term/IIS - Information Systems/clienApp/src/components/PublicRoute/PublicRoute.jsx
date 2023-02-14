/**
 * Author: Vojtěch Kulíšek
 */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import userActions from '../../redux/users/userActions';
import Loading from '../Loading/Loading';
import Guest from '../../layouts/Guest/Guest';
const PublicRoute = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch();
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = async () => {
            try {
                await dispatch(userActions.getAuthUser());
                setIsAuthenticate(true);
            } catch (error) {
                setIsAuthenticate(false);
            } finally {
                setIsLoading(false);
            }
        };
        auth();
    }, [dispatch]);

    return !isLoading ? (
        <Route
            {...rest}
            render={(props) =>
                <Guest>
                    <Component {...props} />
                </Guest>
            }
        />
    ) : (
        <Loading />
    );
};

export default PublicRoute;
