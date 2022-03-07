/**
 * Author: Vojtěch Kulíšek
 */
import { useSelector } from 'react-redux';

import FlashMessage from '../../components/FlashMessage/FlashMessage';
import Navbar from './../../components/Navbar/Navbar';

const Guest = ({ children }) => {
    return (
        <>
        <FlashMessage />
        <div className="min-vh-100 dark:bg-neutral-800 bg-neutral-100 dark:text-neutral-200 text-neutral-900">
            <Navbar />
            <main>
                {children}
            </main>
        </div>
        </>
    );
};

export default Guest;
