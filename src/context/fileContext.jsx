import PropTypes from "prop-types";
import { createContext, useState } from "react";

/**
 * fileContext is a context object that is used to share collection of messages
 * between components
 */
const FileContext = createContext({});

/**
 * fileContextProvider is a functional component that serves as a provider for the fileContext.
 * It provides the fileContext to the components within its subtree.
 *
 * @param {Object} props - The properties passed to the component.
 * @returns {JSX.Element} A fileContext.Provider element.
 */
const FileContextProvider = (props) => {
    const [respondData, setRespondData] = useState(null);

    return (
        <FileContext.Provider value={[respondData, setRespondData]}>
            {props.children}
        </FileContext.Provider>
    );
};

export { FileContext, FileContextProvider };

FileContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
