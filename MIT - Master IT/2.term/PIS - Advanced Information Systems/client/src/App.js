
import React, {Fragment} from 'react';
import { BrowserRouter} from 'react-router-dom';
import RouterSwitch from './routes/RouterSwitch';

import './App.css';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import authorizationActions from './redux/authorization/authorizationActions';

function App(props) {

  useEffect(() => {

    return () => {
      // Perform some cleanup on unmount
      props.logout()
    };
  },[])

  return (
    <Fragment>
      <BrowserRouter>
        <RouterSwitch>
        </RouterSwitch>
      </BrowserRouter>
    </Fragment>

  );
}

const mapStateToProps = (state, ownProps) => ({
});

const mapDispatchToProps = (dispatch, ownProps) => ({
 logout: () => dispatch(authorizationActions.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);