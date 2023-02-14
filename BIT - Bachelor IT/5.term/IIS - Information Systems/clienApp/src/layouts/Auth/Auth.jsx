/**
 * Author: Vojtěch Kulíšek
 */
import { useSelector } from 'react-redux';
import BannerEmailVerification from '../../components/BannerEmailVerification/BannerEmailVerification';
import FlashMessage from '../../components/FlashMessage/FlashMessage';
import userSelector from '../../redux/users/userSelector';
import Navbar from './../../components/Navbar/Navbar';

const Auth = ({ children }) => {
    const user = useSelector(userSelector.getUser);

    return (
        <>
        <FlashMessage />
        <div className="min-vh-100 dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-200 text-neutral-900">
            
            <Navbar />
            <main>
                {children}
            </main>
            {/*
                <BannerEmailVerification user={user} />
            */}
            
        </div>
        </>
    );
};

export default Auth;
