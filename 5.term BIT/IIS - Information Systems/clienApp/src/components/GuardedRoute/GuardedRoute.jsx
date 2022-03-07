/**
 * Author: Vojtěch Kulíšek
 */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import userActions from '../../redux/users/userActions';
import Loading from '../Loading/Loading';
import Auth from '../../layouts/Auth/Auth';
import { connect } from "react-redux";
import userSelector from '../../redux/users/userSelector';

const GuardedRoute = ({ component: Component, ...rest }) => {
    const dispatch = useDispatch();
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const auth = async () => {
            try {
                await dispatch(userActions.getAuthUser());
            } catch (error) {
            } finally {
                setIsLoading(false);
            }
        };
        auth();
    }, [dispatch]);

    useEffect(() => {
        if(rest.user?.id !== -1){
            setIsAuthenticate(true);
        }
        else{
            setIsAuthenticate(false);
        }
    },[rest.user])

    return !isLoading ? (
        <Route
            {...rest}
            render={(props) =>
                isAuthenticate ? (
                    <Auth>
                        <Component {...props} />
                    </Auth>
                ) : (
                    <Redirect to={'/login'} />
                )
            }
        />
    ) : (
        <Loading />
    );
};


const mapStateToProps = (state, ownProps) => ({
    user: userSelector.getUser(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(GuardedRoute);
