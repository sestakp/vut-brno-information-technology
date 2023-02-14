import React from "react";
import { ToastProvider } from "react-toast-notifications";
import {
  BrowserRouter,
  Switch
} from "react-router-dom";
import { Layout } from "./components/BasePageStructure/layout/Layout";
import RouterSwitch from "./routes/RouterSwitch";
import './App.css';

import { Provider } from "react-redux";
import {store } from "./redux/store";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Provider store={store}>
      <ToastProvider autoDismiss={true}>
        <BrowserRouter>
          <React.StrictMode>
            <Switch>
              <Layout>
                <RouterSwitch />
              </Layout>
            </Switch>
          </React.StrictMode>
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  )
}

export default App;