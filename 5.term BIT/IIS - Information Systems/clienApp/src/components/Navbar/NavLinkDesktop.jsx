/**
 * Author: Vojtěch Kulíšek
 */
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import ConferenceActions from "../../redux/conferences/conferenceActions"
const NavLinkDesktop = ({ children,clear, ...rest }) => {

    return (
        <NavLink
            {...rest}
            activeClassName="border-lightBlue-500 text-neutral-900 dark:text-neutral-400 hover:border-lightBlue-500"
            className="inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 border-transparent text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 hover:text-neutral-700 dark:hover:text-neutral-200"
        
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
  
export default connect(mapStateToProps, mapDispatchToProps)(NavLinkDesktop);
