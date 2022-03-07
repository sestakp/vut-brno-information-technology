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
import { connect } from "react-redux";
import ConferenceActions from '../../redux/conferences/conferenceActions';
import ConferenceSelector from '../../redux/conferences/conferenceSelector';
import TicketActions from '../../redux/tickets/ticketActions';
import ButtonNormal from '../../components/ButtonNormal/ButtonNormal';

const ConferenceReservationForm = (props) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState();
    const [isLoading, setIsLoading] = useState();
    const hasErrors = useRef(false);
    const history = useHistory();
    
    const register = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        hasErrors.current = false;
        setErrors({ email: [], name: [] });
        try {
            let emailError = [];
            let nameError = [];
            if(email === ""){
                emailError = ["Email is required"]
            }
            
            if(name === ""){
                nameError = ["Name is required"]
            }

            if(emailError.length !== 0 || nameError.length !== 0){
                
                setErrors({email: emailError, name: nameError})
                return;
            }
            
            if (email.trim() && name.trim()) {
                let response = await userClient.registerGuestAccount({
                    name: name,
                    email: email,
                    role: "guest",
                });

                let guestUser = response.data;
                if(guestUser.id === undefined){
                    setErrors({ email: ["This email is laready register, please sign in"], name: []})
                    return;
                }

                let ticketPromise = props.createTicket({
                    conference_id: props.conference?.id,
                    status: 'reserved',
                    user_id: guestUser.id,
                });

                ticketPromise.then(ticket => {
                    if(ticket === ""){
                        setErrors({ email: ["On this email was already reserver ticket on this conference"], name: []})
                        return;
                    }
                })

                if (!hasErrors.current) {
                    history.goBack();
                }
            }

        } catch (error) {
            console.error("error: ", error);
            hasErrors.current = true;
            if (error.status === 422) {
                setErrors(errors);
            } else if (error.status === 429) {
                setErrors({
                    email: ['Too many request! Try again Later'],
                    name: [],
                });
            } else {
                setErrors({
                    email: ['Impossible to reach the server! Try again later'],
                    name: [],
                });
            }
        } finally {
            setIsLoading(false);

        }
    };

    useEffect(() => {
        props.GetById(props?.match?.params?.id);
    }, []);

    return (
        <>
            
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="px-4 py-8 bg-white-no-important shadow dark:bg-neutral-700 sm:rounded-lg sm:px-10">
                    <h2>Reserve ticket</h2>
                    <p>Reservation on conference: {props.conference?.code}</p>
                    <form className="space-y-6">
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
                        <ButtonNormal onClick={(e) => register(e)} isLoading={isLoading}>
                            <span>RESERVE TICKET</span>
                        </ButtonNormal>
                    </form>
                </div>
            </div>
        </>
    );
};

const mapStateToProps = (state, ownProps) => ({
    conference: ConferenceSelector.getById(state,ownProps?.match?.params?.id),
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    GetById: (id) => dispatch(ConferenceActions.GetById(id)),
    createTicket: (ticket) => dispatch(TicketActions.Create(ticket)),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(ConferenceReservationForm);
