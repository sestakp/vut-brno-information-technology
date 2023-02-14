/**
 * Author: Lukáš Plevač
 */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PasswordChangeForm from '../../../components/PasswordChangeForm/PasswordChangeForm';
import ProfileInfoForm from '../../../components/ProfileInfoForm/ProfileInfoForm';
import userSelector from '../../../redux/users/userSelector';
import { getRoute } from '../../../routes/routes';
import UserTable from '../../../components/UserTable/UserTable';
import LayoutWrapper from '../../../layouts/LayoutWrapper/LayoutWrapper';
import TicketPanel from '../../../components/TicketPanel/TicketPanel';
import PresentationPanel from '../../../components/PresentationPanel/PresentationPanel';

const UserProfile = () => {
    const user = useSelector(userSelector.getUser);

    return (
        <LayoutWrapper>
            {!user.is_github_account ? (
                <div className="row">
                    <div className="col-md-8">
                        <ProfileInfoForm />
                        <PasswordChangeForm />
                        <UserTable />
                    </div>
                    <div className="col-md-4">
                        <TicketPanel />
                        <div className="mt-5">
                            <PresentationPanel />
                        </div>
                    </div>
                </div>
            ) : (
                <Redirect to={getRoute('home').path} />
            )}
        </LayoutWrapper>
    );
};

export default UserProfile;
