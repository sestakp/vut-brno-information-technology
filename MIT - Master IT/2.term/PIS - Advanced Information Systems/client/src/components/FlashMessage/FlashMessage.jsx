import { Transition } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification } from '../../redux/notifications/notificationActions';
import { getNotification } from '../../redux/notifications/notificationSelector';
import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import "./FlashMessage.css";
import { Paper } from '@mui/material';
import { connect } from 'react-redux';

const FlashMessage = (props) => {
   

    const handleClose = (event, reason) => {

        if (reason === 'clickaway') {
          return;
        }
        props.setNotification({
            show: false,
            status: "success", //with status '' component write error into console
            message: "",
        })
      };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return(
        <Snackbar open={props.notification.show} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal:"left" }} onClose={handleClose}>
            <Alert onClose={handleClose} severity={props.notification.status} sx={{ width: '100%' }}>
            {props.notification.message}
            </Alert>
      </Snackbar>
    )

   
};


const mapStateToProps = (state, ownProps) => ({
    notification: getNotification(state)
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    setNotification: (newNotification) => dispatch(setNotification(newNotification))
});
  
export default connect(mapStateToProps, mapDispatchToProps)(FlashMessage);