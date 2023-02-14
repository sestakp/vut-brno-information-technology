/**
 * Author: Pavel Šesták
 */
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import ConferenceActions from "../../redux/conferences/conferenceActions"

const NavLinkMobile = ({ children, clear, ...rest }) => {
    return (
        <NavLink
            {...rest}
            activeClassName="text-primary-700 border-primary-500 bg-primary-50 dark:bg-primary-300"
            className="block py-2 pl-3 pr-4 text-base font-medium text-gray-500 border-l-4 border-transparent hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            onClick={() => { 
                clear(); 
                if(rest?.onClick !== undefined) {
                    rest?.onClick(); 
                }
            }}
        >
            {children}
        </NavLink>
    );
};


const mapStateToProps = (state, ownProps) => ({
});
  
const mapDispatchToProps = (dispatch, ownProps) => ({
    clear: () => dispatch(ConferenceActions.ClearSelected()),
});
  
export default connect(mapStateToProps, mapDispatchToProps)(NavLinkMobile);
