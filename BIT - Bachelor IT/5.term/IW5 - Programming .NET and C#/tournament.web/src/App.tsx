import React from 'react';
import './App.css';
import BasicLayout from "./layout/BasicLayout";
import RouteSwitch from "./routes/RouteSwitch";

//https://github.com/ganeshmani/react-redux-typescript-example
const App: React.FC = () => {
  return (
    <BasicLayout>
      <RouteSwitch >
      </RouteSwitch>
    </BasicLayout>
  );
}

export default App;
