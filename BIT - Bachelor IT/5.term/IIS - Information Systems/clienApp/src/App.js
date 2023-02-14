import { BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import RouterSwitch from './routes/RouterSwitch';
import Auth from './layouts/Auth/Auth';


const App = () => {    

    return (
        <BrowserRouter basename={(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "" : '/~xsesta07/IIS/'}>
                <RouterSwitch>
                    
                </RouterSwitch>
        </BrowserRouter>
    );
};

export default App;
