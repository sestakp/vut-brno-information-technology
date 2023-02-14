/**
 * Author: Vojtěch Kulíšek
 */
import "./ButtonNormal.css";

const ButtonNormal = ({
    children,
    ...rest
}) => {
    return (
        <button {...rest} className="button-normal flex items-center justify-center hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 space-x-4 text-sm font-bold text-white bg-primary-500 dark:bg-primary-600 border border-transparent rounded-md shadow-sm">
        {children}
        </button>
    );
};

export default ButtonNormal;
