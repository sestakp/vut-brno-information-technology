/**
 * Author: Vojtěch Kulíšek
 */
import RecordEditPanel from '../../components/RecordEditPanel/RecordEditPanel';

const LayoutWrapper = ({ children }) => {

    return(
        <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">{children}</div>
        </div>
    )
}

export default LayoutWrapper;